const nodemailer = require('nodemailer');
const dns = require('dns');

/**
 * Sends an email using Gmail SMTP via Nodemailer.
 * Optimized for Railway by forcing IPv4 and using the 'service' shortcut.
 */
const sendEmailWithAttachment = async ({ to, subject, text, html, attachments }) => {
    // Force IPv4 resolution to prevent ENETUNREACH on Railway
    try {
        dns.setDefaultResultOrder('ipv4first');
    } catch (e) {
        // Fallback for older node versions
    }

    console.log(`Attempting to send email via Gmail SMTP to: ${to} with subject: ${subject}`);
    
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // This must be a 16-character App Password
            },
            // High timeouts to handle cloud network jitter
            connectionTimeout: 15000, 
            greetingTimeout: 15000,
            socketTimeout: 20000,
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully via Gmail SMTP: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('CRITICAL: Error sending email via Gmail SMTP:');
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);
        
        if (error.code === 'ENETUNREACH' || error.code === 'ETIMEDOUT') {
            console.error('HINT: Railway is having trouble reaching Google servers. Forcing IPv4 should help.');
        } else if (error.code === 'EAUTH') {
            console.error('HINT: Authentication failed. Ensure you are using a 16-character "App Password", NOT your regular Gmail password.');
        }
        
        throw error;
    }
};

module.exports = { sendEmailWithAttachment };
