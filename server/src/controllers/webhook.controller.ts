import { Request, Response } from 'express';
import crypto from 'crypto';
import Order from '../models/form-submissions/order.model';
import PaymentSettings from '../models/settings/payment-settings.model';
import { decrypt } from '../utils/encryption';
import { paymentStatus } from '../constants/status';
import { razorpayConfig } from '../config/razorpay';

// @desc    Handle Razorpay Webhooks
// @route   POST /api/webhooks/razorpay
// @access  Public (Signature Verified)
export const handleRazorpayWebhook = async (req: Request, res: Response) => {
    console.log('--- Razorpay Webhook Hit ---');
    console.log('Headers:', JSON.stringify(req.headers));
    try {
        const signature = req.headers['x-razorpay-signature'] as string;
        const body = JSON.stringify(req.body);

        // Ideally, we should fetch the webhook secret from settings or env
        // For now, let's assume it's in env or we can verify against the keySecret??
        // Razorpay webhooks have a specific secret you set in the dashboard.
        // Let's use PROCESS.ENV.RAZORPAY_WEBHOOK_SECRET if available, otherwise fallback or skip for now?
        // User didn't specify where secret comes from. I will assume env for safety.

        // ===================================
        // SECURITY CHECK - UNCOMMENT FOR PROD
        // ===================================
        // For production, you MUST ensure RAZORPAY_WEBHOOK_SECRET is set in your .env
        // and in the Razorpay Dashboard. This verification prevents fake requests.

        const webhookSecret = razorpayConfig.webhookSecret; // Retrieved from .env or config

        if (webhookSecret) {
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(body)
                .digest('hex');

            if (expectedSignature !== signature) {
                console.error('Invalid Razorpay Webhook Signature');
                // Return 200 to silence Razorpay retry, or 400 to signal error.
                return res.status(400).json({ message: 'Invalid signature' });
            }
        } else {
            console.warn('RAZORPAY_WEBHOOK_SECRET not set, skipping signature verification (NOT SECURE)');
        }
        // ===================================

        const event = req.body.event;
        const payload = req.body.payload;

        console.log('Razorpay Webhook Event:', event);

        if (event === 'payment_link.paid') {
            const entity = payload.payment_link.entity;
            const refId = entity.reference_id; // This matches our bookingId or _id
            const paymentId = payload.payment?.entity?.id || entity.id; // Or payment_link.entity.id ? No, payment_link has its own ID. We want the Payment ID usually.
            // payload.payment.entity gives the payment details if included.

            // Find Order
            // Try bookingId first, then _id
            let order = await Order.findOne({ bookingId: refId });
            if (!order && refId.match(/^[0-9a-fA-F]{24}$/)) {
                order = await Order.findById(refId);
            }

            if (order) {
                // Update Order Payment Status
                console.log(`Updating payment status for order ${order._id} to PAID`);

                order.paymentStatus = 1; // 1: Paid (as requested: 0: Unpaid, 1: Paid, 2: Pending)

                if (order.payment) {
                    order.payment.transactionId = paymentId;
                } else {
                    order.payment = {
                        transactionId: paymentId
                    };
                }

                await order.save();
                console.log('Order status updated successfully via webhook');
            } else {
                console.error(`Order not found for reference_id: ${refId}`);
            }
        }

        res.status(200).json({ status: 'ok' });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
