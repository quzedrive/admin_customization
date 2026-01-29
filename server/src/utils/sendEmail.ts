import axios from 'axios';
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
        base64Content?: string; // Mailjet specific: pass base64 string here if needed
        cid?: string; // Content-ID for inline images
    }>;
}

const sendEmail = async (options: EmailOptions) => {
    // 1. Fetch Email Config
    const config = await EmailConfig.getSingleton();

    if (!config.apiKey || !config.apiSecret) {
        throw new Error('Mailjet API Key/Secret not configured. Please contact the administrator.');
    }

    // 2. Decrypt API Secret
    let apiSecret = config.apiSecret;
    try {
        apiSecret = decrypt(config.apiSecret);
    } catch (e) {
        console.error('Failed to decrypt Mailjet API Secret', e);
        throw new Error('Email Configuration Error: Invalid Secret');
    }

    // 3. Prepare Mailjet Request
    const fromEmail = config.fromEmail
        ? config.fromEmail
        : 'admin@quzeedrive.com'; // Fallback if not set
    const fromName = config.fromName || 'Admin Support';

    const auth = Buffer.from(`${config.apiKey}:${apiSecret}`).toString('base64');

    const data = {
        Messages: [
            {
                From: {
                    Email: fromEmail,
                    Name: fromName
                },
                To: [
                    {
                        Email: options.email,
                        Name: "User" // Or pass name from options if available
                    }
                ],
                Subject: options.subject,
                TextPart: options.message,
                HTMLPart: options.html || options.message.replace(/\n/g, '<br>'),
                // Handle attachments
                Attachments: options.attachments
                    ?.filter(att => !att.cid)
                    .map(att => ({
                        ContentType: att.contentType || 'application/octet-stream',
                        Filename: att.filename,
                        Base64Content: att.base64Content || (att.content ? Buffer.from(att.content).toString('base64') : '')
                    })),
                InlinedAttachments: options.attachments
                    ?.filter(att => att.cid)
                    .map(att => ({
                        ContentType: att.contentType || 'application/octet-stream',
                        Filename: att.filename,
                        ContentID: att.cid,
                        Base64Content: att.base64Content || (att.content ? Buffer.from(att.content).toString('base64') : '')
                    }))
            }
        ]
    };

    try {
        const response = await axios.post('https://api.mailjet.com/v3.1/send', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        });
        // Success
    } catch (error: any) {
        console.error('Mailjet API Error:', error.response?.data || error.message);
        throw new Error('Failed to send email via Mailjet');
    }
};

export default sendEmail;
