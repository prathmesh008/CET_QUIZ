
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from parent directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function testEmail() {
    console.log("Attempting to send test email...");
    console.log("User:", process.env.EMAIL_USER);
    // Hide pass for security in logs, just print length
    console.log("Pass length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to self
        subject: 'Test Email form Quiz App',
        text: 'If you see this, email sending is working!'
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}

testEmail();
