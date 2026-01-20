import cron from 'node-cron';
import sgMail from '@sendgrid/mail';
import MockTest from '../models/MockTestSchema.js';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendReminderEmail = async (email, testTitle, startTime) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
                .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
                .highlight-box { background-color: #f8f9fa; border-left: 4px solid #764ba2; padding: 20px; margin: 20px 0; border-radius: 4px; }
                .test-title { font-size: 20px; font-weight: 600; color: #2d3748; display: block; margin-bottom: 10px; }
                .time { font-size: 18px; color: #764ba2; font-weight: 600; }
                .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #718096; font-size: 14px; border-top: 1px solid #e2e8f0; }
                .cta-button { display: inline-block; background-color: #764ba2; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Upcoming Mock Test Reminder</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>This is a quick reminder that your upcoming mock test is starting soon.</p>
                    
                    <div class="highlight-box">
                        <span class="test-title">${testTitle}</span>
                        <span>Starts at: <span class="time">${new Date(startTime).toLocaleString()}</span></span>
                    </div>

                    <p>Please ensure you are ready and logged in at least <strong>5 minutes</strong> before the scheduled start time to avoid any last-minute issues.</p>

                    <div style="text-align: center;">
                        <a href="http://localhost:3000" class="cta-button">Go to Dashboard</a>
                    </div>
                </div>
                <div class="footer">
                    <p>Good Luck!<br>The Quiz App Team</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const msg = {
        to: email,
        from: process.env.EMAIL_FROM, // Use the verified sender email here
        subject: `Reminder: ${testTitle} Starts in 30 Minutes!`,
        html: htmlContent,
    };

    try {
        await sgMail.send(msg);
        console.log(`Reminder email sent to ${email}`);
        return true;
    } catch (error) {
        console.error(`Failed to send email to ${email}:`);
        if (error.response) {
            console.error(error.response.body);
        }
        return false;
    }
};

const checkReminders = async () => {
    console.log('⏰ Reminder Service executing at:', new Date().toLocaleTimeString());
    try {
        const now = new Date();

        // Limit query to tests starting in the next hour
        const upcomingTests = await MockTest.find({
            scheduledDate: {
                $gt: now,
                $lt: new Date(now.getTime() + 60 * 60000)
            }
        });

        if (upcomingTests.length > 0) {
            console.log(`🔎 Found ${upcomingTests.length} upcoming tests.`);
        }

        for (const test of upcomingTests) {
            const timeDiff = test.scheduledDate - now;
            const minutesLeft = timeDiff / 60000;

            console.log(`   - "${test.title}" starts in ${minutesLeft.toFixed(1)} mins`);

            // Logic: Send email if test is starting in <= 35 minutes (and we haven't sent it yet)
            if (minutesLeft <= 35 && minutesLeft > 0) {
                // Check enrolled users
                let updated = false;
                for (const enrollment of test.enrollmentDetails) {
                    if (enrollment.email && !enrollment.emailSent) {
                        console.log(`     📤 Sending email to ${enrollment.email}...`);
                        const sent = await sendReminderEmail(enrollment.email, test.title, test.scheduledDate);
                        if (sent) {
                            enrollment.emailSent = true;
                            updated = true;
                            console.log(`     ✅ Email sent!`);
                        } else {
                            console.log(`     ❌ Failed to send.`);
                        }
                    } else if (enrollment.email && enrollment.emailSent) {
                        console.log(`     ℹ️ Email already sent to ${enrollment.email}`);
                    }
                }

                if (updated) {
                    await test.save();
                    console.log('     💾 Test record updated.');
                }
            }
        }
    } catch (error) {
        console.error("Error in reminder service:", error);
    }
};

const initReminderService = () => {
    console.log("Initializing Reminder Service...");

    // Run immediately on start
    checkReminders();

    // Run every minute
    cron.schedule('* * * * *', () => {
        checkReminders();
    });

    console.log("Reminder service started and scheduled.");
};

export default initReminderService;
