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

        // Diagnostic: Check if we can resolve the host
        try {
            const { address } = await dns.promises.lookup(host);
            console.log(`DNS Lookup Success: ${host} -> ${address}`);
        } catch (dnsErr) {
            console.error(`DNS Lookup Failed for ${host}:`, dnsErr.message);
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
            // Enable detailed logging
            logger: true,
            debug: true,
            tls: {
                // Do not fail on invalid certs (common with some proxies)
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            },
            connectionTimeout: 30000, // 30s
            greetingTimeout: 30000,
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
