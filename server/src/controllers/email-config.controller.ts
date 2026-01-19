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

        if (configObj.apiSecret) {
            try {
                const decrypted = decrypt(configObj.apiSecret);
                configObj.apiSecret = maskSecret(decrypted);
            } catch (e) {
                configObj.apiSecret = '';
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
        const { apiKey, apiSecret, fromEmail, fromName } = req.body;

        config.apiKey = apiKey ?? config.apiKey;
        config.fromEmail = fromEmail ?? config.fromEmail;
        config.fromName = fromName ?? config.fromName;

        // Handle API Secret Update
        if (apiSecret) {
            let isMasked = false;
            if (config.apiSecret) {
                try {
                    const decryptedCurrent = decrypt(config.apiSecret);
                    const maskedCurrent = maskSecret(decryptedCurrent);
                    if (apiSecret === maskedCurrent) {
                        isMasked = true;
                    }
                } catch (e) {
                    // ignore decryption error
                }
            }
            if (!isMasked) {
                config.apiSecret = encrypt(apiSecret);
            }
        }

        await config.save();

        // Return masked version
        const configObj = config.toObject();
        if (configObj.apiSecret) {
            try {
                const decrypted = decrypt(configObj.apiSecret);
                configObj.apiSecret = maskSecret(decrypted);
            } catch (e) { configObj.apiSecret = ''; }
        }

        res.status(200).json(configObj);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update email config', error: error.message });
    }
};
