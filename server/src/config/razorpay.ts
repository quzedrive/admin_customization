import dotenv from 'dotenv';
import PaymentSettings from '../models/settings/payment-settings.model';
import { decrypt } from '../utils/encryption';

dotenv.config();

export const razorpayConfig = {
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
};

export const getRazorpayConfig = async () => {
    const settings = await PaymentSettings.getSingleton();
    const { keyId, keySecret } = settings.razorpayCredentials;

    let decryptedSecret = '';
    if (keySecret) {
        try {
            decryptedSecret = decrypt(keySecret);
        } catch (error) {
            console.error('Error decrypting Razorpay secret:', error);
        }
    }

    return {
        keyId,
        keySecret: decryptedSecret,
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
    };
};
