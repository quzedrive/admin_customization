import axios from 'axios';
import { getRazorpayConfig } from '../config/razorpay';

interface RefundResult {
    success: boolean;
    refundId?: string;
    error?: string;
}

/**
 * Initiates a refund via Razorpay
 * @param paymentId The Razorpay payment ID
 * @param amount Amount in PAISE (e.g. 10000 for ₹100)
 */
export const initiateRazorpayRefund = async (paymentId: string, amount: number): Promise<RefundResult> => {
    try {
        const config = await getRazorpayConfig();
        
        if (!config.keyId || !config.keySecret) {
            return { success: false, error: 'Razorpay configuration missing' };
        }

        const auth = Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64');
        
        console.log(`Initiating Razorpay Refund for Payment: ${paymentId}, Amount: ${amount} paise`);

        const response = await axios.post(
            `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
            {
                amount: amount,
                // notes: { reason: "Customer Cancellation - Tax Held" }
            },
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            refundId: response.data.id
        };
    } catch (error: any) {
        console.error('Razorpay Refund Error:', error?.response?.data || error.message);
        return {
            success: false,
            error: error?.response?.data?.error?.description || error.message
        };
    }
};
