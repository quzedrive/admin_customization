import nodemailer from 'nodemailer';
import EmailConfig from '../models/email-config.model';
import { decrypt } from './encryption';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
    html?: string;
    attachments?: Array<{
        filename: string;
        content?: any;
        path?: string;
        contentType?: string;
    }>;
}

const sendEmail = async (options: EmailOptions) => {
    // 1. Fetch Email Config
    const config = await EmailConfig.getSingleton();

    if (!config.host || !config.user || !config.pass) {
        throw new Error('SMTP Settings not configured. Please contact the administrator.');
    }

    // 2. Decrypt Password
    let smtpPassword = config.pass;
    if (config.pass.includes(':')) {
        try {
            smtpPassword = decrypt(config.pass);
        } catch (e) {
            console.error('Failed to decrypt SMTP password', e);
            throw new Error('SMTP Configuration Error');
        }
    }

    // 3. Create Transporter
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure, // true for 465, false for other ports
        auth: {
            user: config.user,
            pass: smtpPassword,
        },
    });

    // 4. Define Email Options
    const mailOptions = {
        from: `"${config.fromName || 'Admin Support'}" <${config.fromEmail || config.user}>`,
        to: options.email,
        subject: options.subject,
        text: options.message, // Fallback plain text
        html: options.html || options.message.replace(/\n/g, '<br>'), // HTML content or converted text
        attachments: options.attachments,
    };

    // 5. Send Email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
