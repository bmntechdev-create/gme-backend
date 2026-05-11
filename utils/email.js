const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 because Railway/Node.js 17+ sometimes defaults to IPv6 
// which causes ENETUNREACH errors with some SMTP servers.
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const sendEmailWithAttachment = async ({ to, subject, text, html, attachments }) => {
    try {
        const host = (process.env.EMAIL_HOST || '').trim();
        const port = parseInt(process.env.EMAIL_PORT || '587');
        const secure = port === 465;

        if (!host || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email configuration is missing or incomplete.');
        }

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user: (process.env.EMAIL_USER || '').trim(),
                pass: (process.env.EMAIL_PASS || '').trim(),
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 20000,
            greetingTimeout: 20000,
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
        console.error('Error sending email:', error.message);
        throw error;
    }
};

module.exports = { sendEmailWithAttachment };
