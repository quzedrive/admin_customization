import { Request, Response } from 'express';
import ImageUploadConfig from '../models/image-upload-config.model';
import { decrypt, encrypt, maskSecret } from '../utils/encryption';
import { configureCloudinary } from '../config/cloudinary.config';

// @desc    Get image upload configuration
// @route   GET /api/settings/image-upload
// @access  Private/Admin
export const getImageUploadConfig = async (req: Request, res: Response) => {
    try {
        const config = await ImageUploadConfig.getSingleton();
        const configObj = config.toObject();

        if (configObj.cloudinary && configObj.cloudinary.apiSecret) {
            try {
                const decrypted = decrypt(configObj.cloudinary.apiSecret);
                configObj.cloudinary.apiSecret = maskSecret(decrypted);
            } catch (e) {
                configObj.cloudinary.apiSecret = '';
            }
        }

        res.status(200).json(configObj);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch image upload config', error: error.message });
    }
};

// @desc    Update image upload configuration
// @route   PUT /api/settings/image-upload
// @access  Private/Admin
export const updateImageUploadConfig = async (req: Request, res: Response) => {
    try {
        const config = await ImageUploadConfig.getSingleton();
        const { provider, cloudinary } = req.body;

        config.provider = provider ?? config.provider;

        if (cloudinary) {
            config.cloudinary = {
                ...config.cloudinary,
                cloudName: cloudinary.cloudName ?? config.cloudinary.cloudName,
                apiKey: cloudinary.apiKey ?? config.cloudinary.apiKey,
            };

            // Handle API Secret Update
            if (cloudinary.apiSecret) {
                let isMasked = false;
                if (config.cloudinary?.apiSecret) {
                    try {
                        const decryptedCurrent = decrypt(config.cloudinary.apiSecret);
                        const maskedCurrent = maskSecret(decryptedCurrent);
                        if (cloudinary.apiSecret === maskedCurrent) {
                            isMasked = true;
                        }
                    } catch (e) {
                        // ignore
                    }
                }

                if (!isMasked) {
                    config.cloudinary.apiSecret = encrypt(cloudinary.apiSecret);
                }
            }
        }

        await config.save();

        // Re-configure Cloudinary immediately with new settings
        await configureCloudinary();

        // Return masked version
        const configObj = config.toObject();
        if (configObj.cloudinary && configObj.cloudinary.apiSecret) {
            const decrypted = decrypt(configObj.cloudinary.apiSecret);
            configObj.cloudinary.apiSecret = maskSecret(decrypted);
        }

        res.status(200).json(configObj);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update image upload config', error: error.message });
    }
};
