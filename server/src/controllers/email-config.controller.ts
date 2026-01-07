import { Request, Response } from 'express';
import EmailConfig from '../models/email-config.model';
import { decrypt, encrypt, maskSecret } from '../utils/encryption';

// @desc    Get email configuration
// @route   GET /api/settings/email
// @access  Private/Admin
export const getEmailConfig = async (req: Request, res: Response) => {
    try {
        const config = await EmailConfig.getSingleton();
        const configObj = config.toObject();

        // Reveal only prefix of password
        if (configObj.pass) {
            try {
                const decrypted = decrypt(configObj.pass);
                configObj.pass = maskSecret(decrypted);
            } catch (e) {
                configObj.pass = ''; // Clear if decryption fails
            }
        }

        res.status(200).json(configObj);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch email config', error: error.message });
    }
};

// @desc    Update email configuration
// @route   PUT /api/settings/email
// @access  Private/Admin
export const updateEmailConfig = async (req: Request, res: Response) => {
    try {
        const config = await EmailConfig.getSingleton();
        const { host, port, user, pass, secure, fromEmail, fromName } = req.body;

        config.host = host ?? config.host;
        config.port = port ?? config.port;
        config.user = user ?? config.user;
        config.secure = secure ?? config.secure;
        config.fromEmail = fromEmail ?? config.fromEmail;
        config.fromName = fromName ?? config.fromName;

        // Handle Password Update
        if (pass) {
            // Check if pass is the masked version (starts with 5 chars + 10 asterisks)
            let isMasked = false;
            if (config.pass) {
                try {
                    const decryptedCurrent = decrypt(config.pass);
                    const maskedCurrent = maskSecret(decryptedCurrent);
                    if (pass === maskedCurrent) {
                        isMasked = true;
                    }
                } catch (e) {
                    // ignore decryption error
                }
            }

            // Only update if it's NOT the masked version (meaning user typed a new password)
            if (!isMasked) {
                config.pass = encrypt(pass);
            }
        }

        await config.save();

        // Return masked version
        const configObj = config.toObject();
        if (configObj.pass) {
            const decrypted = decrypt(configObj.pass);
            configObj.pass = maskSecret(decrypted);
        }

        res.status(200).json(configObj);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update email config', error: error.message });
    }
};
