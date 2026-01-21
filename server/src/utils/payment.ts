import axios from 'axios';
import QRCode from 'qrcode';
import PaymentSettings from '../models/settings/payment-settings.model';
import { PaymentMethod } from '../constants/payment';
import { getRazorpayConfig } from '../config/razorpay';

interface PaymentDetailsResult {
    type: 'qr' | 'link' | 'none';
    qrBuffer?: Buffer;
    paymentLink?: string;
    paymentLinkId?: string;
    vpa?: string;
    amount?: number;
}

export const generatePaymentDetails = async (order: any): Promise<PaymentDetailsResult> => {
    try {
        const settings = await PaymentSettings.getSingleton();
        const amount = order.finalPrice || 0;

        if (amount <= 0) return { type: 'none' };

        if (settings.activeMethod === PaymentMethod.RAZORPAY) {
            const config = await getRazorpayConfig();

            if (!config.keyId || !config.keySecret) {
                console.error('Razorpay credentials missing');
                return { type: 'none' };
            }

            try {
                const auth = Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64');

                // Normalize phone number for Razorpay (E.164 format preferred, or at least with country code)
                let contact = order.phone.replace(/[^0-9]/g, '');
                if (contact.length === 10) {
                    contact = `+91${contact}`;
                } else if (contact.length > 10 && !contact.startsWith('+')) {
                    contact = `+${contact}`;
                }

                const response = await axios.post(
                    'https://api.razorpay.com/v1/payment_links',
                    {
                        amount: Math.round(amount * 100), // Amount in paise
                        currency: "INR",
                        accept_partial: false,
                        description: `Payment for Order ${order.bookingId || order._id}`,
                        customer: {
                            name: order.name,
                            contact: contact,
                            email: order.email
                        },
                        notify: {
                            sms: true,
                            email: true
                        },
                        reminder_enable: true,
                        reference_id: order.bookingId || order._id.toString(),
                        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-status/${order._id}`,
                        callback_method: "get"
                    },
                    {
                        headers: {
                            'Authorization': `Basic ${auth}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                return {
                    type: 'link',
                    paymentLink: response.data.short_url,
                    paymentLinkId: response.data.id,
                    amount
                };
            } catch (error: any) {
                console.error('Razorpay Link Generation Error:', error?.response?.data || error.message);
                return { type: 'none' };
            }

        } else if (settings.activeMethod === PaymentMethod.MANUAL) {
            const { upiId } = settings.manualPaymentDetails;
            const merchantName = process.env.MERCHANT_NAME || 'Quzee Drive'; // Or fetch from settings if available
            const transactionNote = `Order ${order.bookingId || order._id}`;
            const trRef = order.bookingId || order._id.toString();

            if (!upiId) return { type: 'none' };

            // upi://pay?pa=<vpa>&pn=<name>&am=<amount>&tn=<note>&tr=<ref>
            const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&tr=${trRef}`;

            const qrBuffer = await QRCode.toBuffer(upiUrl);
            return {
                type: 'qr',
                qrBuffer,
                vpa: upiId,
                amount
            };
        }

        return { type: 'none' };
    } catch (error) {
        console.error('Generate Payment Details Error:', error);
        return { type: 'none' };
    }
};
