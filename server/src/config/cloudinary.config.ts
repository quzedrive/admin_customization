import { v2 as cloudinary } from 'cloudinary';
import ImageUploadConfig from '../models/image-upload-config.model';
import { decrypt } from '../utils/encryption';

export const configureCloudinary = async () => {
    try {
        const config = await ImageUploadConfig.getSingleton();

        if (config && config.cloudinary && config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
            let apiSecret = config.cloudinary.apiSecret;

            // Try to decrypt if it looks encrypted (contains colon)
            // Note: simple check, encryption util usually produces hex:hex
            if (apiSecret.includes(':')) {
                try {
                    apiSecret = decrypt(apiSecret);
                } catch (e) {
                    // console.error("Failed to decrypt cloudinary secret", e);
                }
            }

            cloudinary.config({
                cloud_name: config.cloudinary.cloudName,
                api_key: config.cloudinary.apiKey,
                api_secret: apiSecret
            });
        } else {
            // Fallback to env or log warning
            // console.log("Cloudinary config missing in DB, using existing/env if available");
        }
    } catch (error) {
        console.error("Failed to configure Cloudinary from DB:", error);
    }
};

export default cloudinary;
