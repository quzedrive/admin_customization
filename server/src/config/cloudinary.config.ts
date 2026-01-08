import { v2 as cloudinary } from 'cloudinary';
import ImageUploadConfig from '../models/image-upload-config.model';
import { decrypt } from '../utils/encryption';

export const configureCloudinary = async () => {
    try {
        const config = await ImageUploadConfig.getSingleton();

        if (config && config.cloudinary && config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
            let apiSecret = config.cloudinary.apiSecret;
            let decryptionFailed = false;

            // Try to decrypt if it looks encrypted (contains colon)
            if (apiSecret.includes(':')) {
                try {
                    apiSecret = decrypt(apiSecret);
                } catch (e) {
                    console.error("Failed to decrypt cloudinary secret - falling back to environment variables", e);
                    decryptionFailed = true;
                }
            }

            // Only use database config if decryption succeeded (or wasn't needed)
            if (!decryptionFailed) {
                cloudinary.config({
                    cloud_name: config.cloudinary.cloudName,
                    api_key: config.cloudinary.apiKey,
                    api_secret: apiSecret
                });

                console.log('✓ Cloudinary configured from database');
                console.log(`  Cloud Name: ${config.cloudinary.cloudName}`);
                return; // Success - exit early
            }
        }

        // Fallback to environment variables (if DB config missing or decryption failed)
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
            console.log('✓ Cloudinary configured from environment variables');
            console.log(`  Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
            console.log(`  API Key: ${process.env.CLOUDINARY_API_KEY?.substring(0, 8)}...`);
        } else {
            console.warn('⚠ Cloudinary configuration missing in both DB and environment variables!');
            console.warn('  File uploads will fail until Cloudinary is properly configured.');
            console.warn('  Check your .env file or database configuration.');
        }
    } catch (error) {
        console.error("Failed to configure Cloudinary from DB:", error);

        // Try environment variables as fallback
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
            console.log('✓ Cloudinary configured from environment variables (fallback)');
        }
    }
};

export default cloudinary;
