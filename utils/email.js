const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 because Railway/Node.js 17+ sometimes defaults to IPv6 
// which causes ENETUNREACH errors with some SMTP servers.
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const sendEmailWithAttachment = async ({ to, subject, text, html, attachments }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: (process.env.EMAIL_HOST || '').trim(),
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
            auth: {
                user: (process.env.EMAIL_USER || '').trim(),
                pass: (process.env.EMAIL_PASS || '').trim(),
            },
            family: 4, // Force IPv4 to avoid ENETUNREACH errors on Railway
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,   // 10 seconds
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
            html,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', {
            message: error.message,
            code: error.code,
            command: error.command,
            address: error.address,
            port: error.port
        });
        throw error;
    }
};

module.exports = { sendEmailWithAttachment };
