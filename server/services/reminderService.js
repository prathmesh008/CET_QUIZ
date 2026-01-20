import cron from 'node-cron';
import nodemailer from 'nodemailer';
import MockTest from '../models/MockTestSchema.js';

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can Use other services or SMTP
    auth: {
        user: process.env.EMAIL_USER, // Add these to your .env
        pass: process.env.EMAIL_PASS
    }
});

const sendReminderEmail = async (email, testTitle, startTime) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Reminder: ${testTitle} Starts in 30 Minutes!`,
        text: `Hello,\n\nThis is a reminder that your mock test "${testTitle}" is scheduled to start at ${new Date(startTime).toLocaleString()}.\n\nPlease be ready 5 minutes before the start time.\n\nGood Luck!\nQuiz App Team`,
        html: `
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
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${email}`);
        return true;
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        return false;
    }
};

const initReminderService = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);
            const thirtyFiveMinutesLater = new Date(now.getTime() + 35 * 60000); // 5 min buffer

            // Find tests starting between 30 and 35 minutes from now
            // We use a range to avoid missing tests if the cron skips a beat or execution takes time
            // But simpler logic: Find tests starting *soon* and check if we already sent the email.

            // Actually, better logic: Find ALL tests starting in the future (within next 35 mins)
            // Iterate through their enrolled users.
            // If (TestStart - Now <= 30 mins) AND (!emailSent) -> Send Email.

            // Limit query to tests starting in the next hour to be efficient
            const upcomingTests = await MockTest.find({
                scheduledDate: {
                    $gt: now,
                    $lt: new Date(now.getTime() + 60 * 60000)
                }
            });

            for (const test of upcomingTests) {
                const timeDiff = test.scheduledDate - now;
                const minutesLeft = timeDiff / 60000;

                if (minutesLeft <= 30 && minutesLeft > 0) {
                    // Check enrolled users
                    let updated = false;
                    for (const enrollment of test.enrollmentDetails) {
                        if (enrollment.email && !enrollment.emailSent) {
                            const sent = await sendReminderEmail(enrollment.email, test.title, test.scheduledDate);
                            if (sent) {
                                enrollment.emailSent = true;
                                updated = true;
                            }
                        }
                    }

                    if (updated) {
                        await test.save();
                    }
                }
            }

        } catch (error) {
            console.error("Error in reminder service:", error);
        }
    });

    console.log("Reminder service started...");
};

export default initReminderService;
