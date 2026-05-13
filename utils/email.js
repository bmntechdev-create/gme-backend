const nodemailer = require('nodemailer');

const sendEmailWithAttachment = async ({ to, subject, text, html, attachments }) => {
    console.log(`Attempting to send email to: ${to} with subject: ${subject}`);
    
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // Add timeouts to handle network issues on cloud platforms
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,   // 10 seconds
            socketTimeout: 15000,     // 15 seconds
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
        console.log('Email sent successfully: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('CRITICAL: Error sending email via SMTP:');
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);
        console.error('Error Command:', error.command);
        
        // Provide more helpful advice for Railway users
        if (error.code === 'ENETUNREACH' || error.code === 'ETIMEDOUT') {
            console.error('HINT: This is likely a networking issue. Ensure EMAIL_HOST is correct and IPv4 resolution is forced.');
        }
        
        throw error;
    }
};

module.exports = { sendEmailWithAttachment };
