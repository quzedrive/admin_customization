import { Request, Response } from 'express';
import crypto from 'crypto';
import Order from '../models/form-submissions/order.model';
import PaymentSettings from '../models/settings/payment-settings.model';
import { decrypt } from '../utils/encryption';
import { paymentStatus } from '../constants/status';
import { razorpayConfig } from '../config/razorpay';
import { sendOrderBookedEmails } from './order.controller';

// @desc    Handle Razorpay Webhooks
// @route   POST /api/webhooks/razorpay
// @access  Public (Signature Verified)
export const handleRazorpayWebhook = async (req: Request, res: Response) => {
    console.log('--- Razorpay Webhook Hit ---');
    console.log('Headers:', JSON.stringify(req.headers));
    try {
        const signature = req.headers['x-razorpay-signature'] as string;
        const body = JSON.stringify(req.body);

        // Security Check
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

        const event = req.body.event;
        const payload = req.body.payload;

        console.log('Razorpay Webhook Event:', event);

        if (event === 'payment_link.paid') {
            const entity = payload.payment_link.entity;
            const refId = entity.reference_id; // This matches our bookingId or _id
            const paymentId = payload.payment?.entity?.id || entity.id;

            // Find Order
            let order = await Order.findOne({ bookingId: refId });
            if (!order && refId.match(/^[0-9a-fA-F]{24}$/)) {
                order = await Order.findById(refId);
            }

            if (order) {
                console.log(`Updating payment status for order ${order._id} to PAID`);

                // Check if already paid to avoid duplicate emails
                const wasUnpaid = order.paymentStatus !== 1;

                order.paymentStatus = 1; // 1: Paid

                if (order.payment) {
                    order.payment.transactionId = paymentId;
                } else {
                    order.payment = {
                        transactionId: paymentId
                    };
                }

                await order.save();
                console.log('Order status updated successfully via webhook');

                // Send Emails if it was a fresh payment
                if (wasUnpaid) {
                    try {
                        console.log('Triggering email notifications...');
                        await sendOrderBookedEmails(order);
                    } catch (emailError) {
                        console.error('Webhook Email Error:', emailError);
                        // Do not fail the webhook response
                    }
                }
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
