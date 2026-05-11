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
            throw new Error(`Missing email configuration: HOST=${!!host}, USER=${!!process.env.EMAIL_USER}, PASS=${!!process.env.EMAIL_PASS}`);
        }

        console.log(`Attempting to send email via ${host}:${port} (secure: ${secure})`);

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user: (process.env.EMAIL_USER || '').trim(),
                pass: (process.env.EMAIL_PASS || '').trim(),
            },
            // Some environments have issues with IPv6, but family: 4 can sometimes 
            // cause timeouts if IPv4 routing is problematic. 
            // We'll rely on dns.setDefaultResultOrder('ipv4first') at the top of the file instead.
            connectionTimeout: 20000, // Increased to 20s
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
        console.error('Detailed Email Error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            address: error.address,
            port: error.port,
            stack: error.stack
        });
        throw error;
    }
};

module.exports = { sendEmailWithAttachment };
