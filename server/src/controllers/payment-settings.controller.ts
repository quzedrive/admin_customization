import { Request, Response } from 'express';
import PaymentSettings from '../models/settings/payment-settings.model';
import { decrypt, encrypt, maskSecret } from '../utils/encryption';
import { PaymentMethod } from '../constants/payment';

// @desc    Get payment settings (Admin)
// @route   GET /api/settings/payment
// @access  Private/Admin
export const getPaymentSettings = async (req: Request, res: Response) => {
    try {
        const settings = await PaymentSettings.getSingleton();
        const settingsObj = settings.toObject();

        // Handle Razorpay Secret Masking
        if (settingsObj.razorpayCredentials?.keySecret) {
            try {
                const decrypted = decrypt(settingsObj.razorpayCredentials.keySecret);
                settingsObj.razorpayCredentials.keySecret = maskSecret(decrypted);
            } catch (e) {
                settingsObj.razorpayCredentials.keySecret = '';
            }
        }

        res.status(200).json(settingsObj);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch payment settings', error: error.message });
    }
};

// @desc    Update payment settings (Admin)
// @route   PUT /api/settings/payment
// @access  Private/Admin
export const updatePaymentSettings = async (req: Request, res: Response) => {
    try {
        const settings = await PaymentSettings.getSingleton();
        const { activeMethod, manualPaymentDetails, razorpayCredentials } = req.body;

        if (activeMethod) settings.activeMethod = activeMethod;

        if (manualPaymentDetails) {
            settings.manualPaymentDetails.accountName = manualPaymentDetails.accountName ?? settings.manualPaymentDetails.accountName;
            settings.manualPaymentDetails.upiId = manualPaymentDetails.upiId ?? settings.manualPaymentDetails.upiId;
        }

        if (razorpayCredentials) {
            settings.razorpayCredentials.keyId = razorpayCredentials.keyId ?? settings.razorpayCredentials.keyId;

            const newSecret = razorpayCredentials.keySecret;
            if (newSecret) {
                let isMasked = false;
                // Check if the submitted secret matches the masked version of the current secret
                if (settings.razorpayCredentials.keySecret) {
                    try {
                        const decryptedCurrent = decrypt(settings.razorpayCredentials.keySecret);
                        const maskedCurrent = maskSecret(decryptedCurrent);
                        if (newSecret === maskedCurrent) {
                            isMasked = true;
                        }
                    } catch (e) {
                        // ignore
                    }
                }

                // Only encrypt and update if it's NOT the masked version (meaning it's a new real secret)
                if (!isMasked) {
                    settings.razorpayCredentials.keySecret = encrypt(newSecret);
                }
            }
        }

        await settings.save();

        // Return masked response
        const settingsObj = settings.toObject();
        if (settingsObj.razorpayCredentials?.keySecret) {
            try {
                const decrypted = decrypt(settingsObj.razorpayCredentials.keySecret);
                settingsObj.razorpayCredentials.keySecret = maskSecret(decrypted);
            } catch (e) { settingsObj.razorpayCredentials.keySecret = ''; }
        }

        res.status(200).json(settingsObj);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update payment settings', error: error.message });
    }
};

// @desc    Get active payment method (Public/Checkout)
// @route   GET /api/settings/payment/active-method
// @access  Public
export const getActivePaymentMethod = async (req: Request, res: Response) => {
    try {
        const settings = await PaymentSettings.getSingleton();

        const response: any = {
            activeMethod: settings.activeMethod,
        };

        if (settings.activeMethod === PaymentMethod.MANUAL) {
            response.details = settings.manualPaymentDetails;
        } else if (settings.activeMethod === PaymentMethod.RAZORPAY) {
            response.details = {
                keyId: settings.razorpayCredentials.keyId,
                // NEVER return the secret to key public/client
            };
        }

        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch active payment method', error: error.message });
    }
};

// @desc    Update active payment method (Admin)
// @route   PATCH /api/settings/payment/active-method
// @access  Private/Admin
export const updateActiveMethod = async (req: Request, res: Response) => {
    try {
        const { activeMethod } = req.body;

        if (!activeMethod || !Object.values(PaymentMethod).includes(Number(activeMethod))) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        const settings = await PaymentSettings.getSingleton();
        settings.activeMethod = activeMethod;
        await settings.save();

        res.status(200).json({ message: 'Active payment method updated', activeMethod: settings.activeMethod });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update active payment method', error: error.message });
    }
};
