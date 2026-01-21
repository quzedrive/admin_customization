import axios from 'axios';
import { getRazorpayConfig } from '../config/razorpay';
import { Request, Response } from 'express';
import Order from '../models/form-submissions/order.model';
import Car from '../models/cars/car.model';
import { RideStatus } from '../constants/ride';
import SystemTemplate from '../models/system-template.model';
import EmailConfig from '../models/email-config.model';
import sendEmail from '../utils/sendEmail';
import { status } from '../constants/status';

import { generateBookingId } from '../utils/generators';

import SiteSettings from '../models/settings/site-settings.model';
import Notification from '../models/notification.model';
import { getIO } from '../socket';
import { NotificationStatus } from '../constants/notification';
import QRCode from 'qrcode';
import { paymentStatus } from '../constants/status';

// @desc    Create a new order (Public)
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, tripStart, tripEnd, location, message, carName, selectedPackage, carSlug } = req.body;

        // Fetch Site Settings for Prefix
        const siteSettings = await SiteSettings.findOne();
        const prefix = siteSettings?.general?.bookingPrefix || 'QZ';

        // Generate Booking ID
        const bookingId = await generateBookingId(Order, prefix);

        const order = await Order.create({
            name,
            email,
            phone,
            tripStart,
            tripEnd,
            location,
            message,
            carName,
            selectedPackage,
            carSlug,
            bookingId,
            // status and payment defaults used
        });

        // Create & Emit Notification
        try {
            const notification = await Notification.create({
                title: 'New Order Received',
                message: `New booking #${bookingId} from ${name}`,
                type: 'order',
                link: `/admin/order-management/edit-page/${order._id}`,
                status: NotificationStatus.NEW
            });

            try {
                getIO().emit('new_notification', notification);
            } catch (ioError) {
                console.error('Socket IO Emit Error:', ioError);
            }
        } catch (notifError) {
            console.error('Notification Creation Error:', notifError);
        }

        // Fetch email template
        console.log('Fetching system template: order-received');
        const template = await SystemTemplate.findOne({ slug: 'order_received' });
        console.log('Template found:', template ? 'Yes' : 'No', 'Status:', template?.status);

        if (template && template.status === status.active) {
            let emailContent = template.emailContent;
            const subject = template.emailSubject.replace(/{{orderId}}/g, order._id.toString().slice(-6).toUpperCase());

            // Format dates
            const startDate = new Date(tripStart).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

            const emailConfig = await EmailConfig.getSingleton();

            // Replace variables
            emailContent = emailContent
                .replace(/{{name}}/g, name)
                .replace(/{{email}}/g, email)
                .replace(/{{phone}}/g, phone)
                .replace(/{{orderId}}/g, bookingId)
                .replace(/{{carName}}/g, carName || 'N/A')
                .replace(/{{selectedPackage}}/g, selectedPackage || 'N/A')
                .replace(/{{tripStart}}/g, startDate)
                .replace(/{{location}}/g, location || 'N/A')
                .replace(/{{year}}/g, new Date().getFullYear().toString())
                .replace(/{{companyName}}/g, emailConfig.fromName || 'Quzee Drive')
                .replace(/{{supportEmail}}/g, emailConfig.fromEmail || 'support@quzeedrive.com')
                .replace(/{{link}}/g, `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-status/${order._id}`); // Adjust link as needed

            // Send Email
            try {
                console.log('Sending email to:', order.email, 'Subject:', subject);
                await sendEmail({
                    email: order.email,
                    subject: subject,
                    message: `Order Received: ${order._id}`, // Plain text fallback
                    html: emailContent
                });
                console.log('Email sent successfully');
            } catch (emailError) {
                console.error('Failed to send order confirmation email:', emailError);
                // Continue execution, don't fail the order creation because email failed
            }
        } else {
            console.log('Template not found or inactive');
        }

        res.status(201).json(order);
    } catch (error: any) {
        console.error('Create Order Error:', error);
        res.status(400).json({ message: 'Invalid order data', error: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAdminOrders = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';
        const statusParam = req.query.status as string;
        const paymentStatusParam = req.query.paymentStatus as string;
        const sortBy = (req.query.sortBy as string) || 'newest';

        const query: any = { status: { $ne: RideStatus.DELETED } }; // Exclude deleted orders

        if (search) {
            const isObjectId = search.match(/^[0-9a-fA-F]{24}$/);
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { carName: { $regex: search, $options: 'i' } },
                { bookingId: { $regex: search, $options: 'i' } }
            ];
            if (isObjectId) {
                query.$or.push({ _id: search });
            }
        }

        if (statusParam && statusParam !== 'all') {
            query.status = parseInt(statusParam);
        }

        if (paymentStatusParam && paymentStatusParam !== 'all') {
            query.paymentStatus = parseInt(paymentStatusParam);
        }

        // Sorting
        let sortOptions: any = { createdAt: -1 }; // Default: Newest
        if (sortBy === 'oldest') {
            sortOptions = { createdAt: 1 };
        } else if (sortBy === 'tripDesc') {
            sortOptions = { tripStart: -1 };
        } else if (sortBy === 'tripAsc') {
            sortOptions = { tripStart: 1 };
        }

        const skip = (page - 1) * limit;

        const [ordersRaw, total] = await Promise.all([
            Order.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(query)
        ]);

        const orders = await Promise.all(ordersRaw.map(async (order: any) => {
            let hostType = null;
            let hostDetails = null;
            if (order.carSlug) {
                const car = await Car.findOne({ slug: order.carSlug }).select('host.type host.details');
                hostType = car?.host?.type;
                hostDetails = car?.host?.details;
            } else if (order.carName) {
                const car = await Car.findOne({ name: order.carName }).select('host.type host.details');
                hostType = car?.host?.type;
                hostDetails = car?.host?.details;
            }
            return {
                ...order,
                hostType,
                hostDetails
            };
        }));

        const statusCountsAggregation = await Order.aggregate([
            {
                $match: {
                    status: { $ne: RideStatus.DELETED },
                    ...(search ? query.$or ? { $or: query.$or } : {} : {}) // Apply search filter if exists
                }
            },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const statusCounts = statusCountsAggregation.reduce((acc: any, curr: any) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.status(200).json({
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            statusCounts
        });
    } catch (error: any) {
        console.error('Get Admin Orders Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper to send order status emails
import { generatePDF } from '../utils/pdfGenerator';
import { generatePaymentDetails } from '../utils/payment';

const sendOrderStatusEmail = async (order: any, slug: string) => {
    try {
        console.log(`Fetching system template: ${slug}`);
        const template = await SystemTemplate.findOne({ slug });

        if (template && template.status === status.active) {
            let emailContent = template.emailContent;
            const subject = template.emailSubject.replace(/{{orderId}}/g, (order.bookingId || order._id.toString().slice(-6)).toUpperCase());

            const startDate = new Date(order.tripStart).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
            const emailConfig = await EmailConfig.getSingleton();
            const year = new Date().getFullYear().toString();
            const companyName = emailConfig.fromName || 'Quzee Drive';
            const supportEmail = emailConfig.fromEmail || 'support@quzeedrive.com';
            const orderLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-status/${order._id}`;
            const submissionTime = new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

            // Common Replacements
            const replacer = (text: string) => text
                .replace(/{{name}}/g, order.name)
                .replace(/{{email}}/g, order.email)
                .replace(/{{phone}}/g, order.phone)
                .replace(/{{orderId}}/g, (order.bookingId || order._id.toString().slice(-6)).toUpperCase())
                .replace(/{{carName}}/g, order.carName || 'N/A')
                .replace(/{{selectedPackage}}/g, order.selectedPackage || 'N/A')
                .replace(/{{tripStart}}/g, startDate)
                .replace(/{{location}}/g, order.location || 'N/A')
                .replace(/{{year}}/g, year)
                .replace(/{{companyName}}/g, companyName)
                .replace(/{{supportEmail}}/g, supportEmail)
                .replace(/{{link}}/g, orderLink)
                .replace(/{{cancelReason}}/g, order.cancelReason || '')
                .replace(/{{finalPrice}}/g, order.finalPrice ? order.finalPrice.toString() : (order.selectedPackage ? order.selectedPackage.replace(/[^0-9]/g, '') : ''))
                .replace(/{{submissionTime}}/g, submissionTime);

            emailContent = replacer(emailContent);

            // PDF Generation Logic for Confirmation
            let attachments: any[] = [];
            if (slug === 'order_confirmed') {
                console.log('Attempting to generate PDF for order_confirmed');
                try {
                    const agreementTemplate = await SystemTemplate.findOne({ slug: 'rental_agreement' });

                    if (!agreementTemplate) {
                        console.log('Warning: rental_agreement template not found');
                    } else if (agreementTemplate.status !== status.active) {
                        console.log('Warning: rental_agreement template is inactive');
                    }

                    if (agreementTemplate && agreementTemplate.status === status.active) {
                        const agreementHtml = replacer(agreementTemplate.emailContent); // Using emailContent field for document body
                        const pdfBuffer = await generatePDF(agreementHtml);
                        attachments.push({
                            filename: `Rental_Agreement_${order.bookingId || order._id}.pdf`,
                            content: pdfBuffer,
                            contentType: 'application/pdf'
                        });
                        console.log('PDF Agreement generated successfully');
                    }
                } catch (pdfError) {
                    console.error('Failed to generate PDF Agreement:', pdfError);
                }
            }

            // 1. Generate Payment Details (QR or Link) if Order Confirmed
            if (slug === 'order_confirmed') {
                let paymentDetails;

                // Check if valid link already exists for Razorpay
                if (order.payment?.link && order.payment?.linkId) {
                    // Reuse existing link
                    console.log('Reusing existing payment link for order:', order._id);
                    paymentDetails = {
                        type: 'link',
                        paymentLink: order.payment.link,
                        paymentLinkId: order.payment.linkId,
                        amount: order.finalPrice || 0
                    };
                } else {
                    // Generate new details
                    paymentDetails = await generatePaymentDetails(order);

                    // Save if it's a link
                    if (paymentDetails.type === 'link' && paymentDetails.paymentLink) {
                        // We need to update the order object, but we are in a helper function.
                        // We should update the database key.
                        try {
                            await Order.findByIdAndUpdate(order._id, {
                                'payment.link': paymentDetails.paymentLink,
                                'payment.linkId': paymentDetails.paymentLinkId
                            });
                            console.log('Payment link saved to order:', order._id);
                        } catch (saveError) {
                            console.error('Failed to save payment link to order:', saveError);
                        }
                    }
                }

                if (paymentDetails.type === 'qr' && paymentDetails.qrBuffer && paymentDetails.vpa) {
                    attachments.push({
                        filename: `payment_qr.png`,
                        content: paymentDetails.qrBuffer,
                        contentType: 'image/png',
                        cid: 'payment_qr'
                    });

                    const qrHtml = `
                        <div style="margin: 20px 0; text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                            <h3 style="margin-top: 0; color: #333;">Complete Your Payment</h3>
                            <p><strong>Scan to Pay ₹${paymentDetails.amount}</strong></p>
                            <img src="cid:payment_qr" alt="Payment QR Code" style="width: 200px; height: 200px; margin: 10px auto;" />
                            <p style="font-size: 14px; color: #666; margin-bottom: 5px;">UPI ID: <strong>${paymentDetails.vpa}</strong></p>
                            <p style="font-size: 12px; color: #999;">Scan using any UPI App (GPay, PhonePe, Paytm)</p>
                        </div>
                    `;
                    emailContent += qrHtml;
                }
                else if (paymentDetails.type === 'link' && paymentDetails.paymentLink) {
                    const linkHtml = `
                        <div style="margin: 20px 0; text-align: center; padding: 20px; background-color: #f0f7ff; border-radius: 8px; border: 1px solid #cce5ff;">
                            <h3 style="margin-top: 0; color: #004085;">Complete Your Payment</h3>
                            <p style="color: #004085; margin-bottom: 20px;">Please click the button below to pay ₹${paymentDetails.amount} securely via Razorpay.</p>
                            <a href="${paymentDetails.paymentLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Pay Now</a>
                            <p style="font-size: 12px; color: #666; margin-top: 15px;">Link expires in 15 minutes.</p>
                        </div>
                    `;
                    emailContent += linkHtml;
                }
            }

            // 2. Send to Customer
            console.log('Sending email to Customer:', order.email);
            await sendEmail({
                email: order.email,
                subject: subject,
                message: `${slug.replace('_', ' ').toUpperCase()}: ${order.bookingId || order._id}`,
                html: emailContent,
                attachments
            });

            // 2. Send to Admin (Copy) - For ALL status changes
            const adminEmail = 'nilemaxi14@gmail.com';
            console.log('Sending copy to Admin:', adminEmail);
            await sendEmail({
                email: adminEmail,
                subject: `[ADMIN COPY] ${subject}`,
                message: `Copy of ${slug} for Order #${order.bookingId}`,
                html: emailContent,
                attachments
            });

            // 3. Send to Host (if Attachment type) - For ALL status changes
            if (order.carSlug || order.carName) {
                try {
                    const carQuery = order.carSlug ? { slug: order.carSlug } : { name: order.carName };
                    const car = await Car.findOne(carQuery).select('host');

                    if (car && car.host && car.host.type === 2 && car.host.details?.email) {
                        const hostEmail = car.host.details.email;
                        console.log('Sending email to Host:', hostEmail);
                        await sendEmail({
                            email: hostEmail,
                            subject: `[HOST NOTIFICATION] ${subject}`,
                            message: `Notification for your car: ${order.carName}`,
                            html: emailContent, // Or a specific host template if needed
                            attachments
                        });
                    }
                } catch (hostError) {
                    console.error('Failed to fetch host details or send email:', hostError);
                }
            }

            console.log('Email sequence completed');
        } else {
            console.log(`Template ${slug} not found or inactive`);
        }
    } catch (error) {
        console.error(`Failed to send ${slug} email:`, error);
    }
};

// @desc    Update an order
// @route   PUT /api/orders/admin/:id
// @access  Private/Admin
export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const oldStatus = order.status;

        Object.assign(order, updates);
        const updatedOrder = await order.save();

        const newStatus = updatedOrder.status;

        // Check for status change and send email
        if (oldStatus !== newStatus) {
            let slug = '';
            switch (newStatus) {
                case RideStatus.APPROVE: // 1
                    slug = 'order_confirmed';
                    // Auto-set Payment Status to Pending if currently Unpaid
                    if (updatedOrder.paymentStatus === paymentStatus.unpaid) {
                        updatedOrder.paymentStatus = paymentStatus.pending;
                        await updatedOrder.save();
                    }
                    break;
                case RideStatus.CANCEL: // 3
                    slug = 'order_cancelled';
                    break;
                case RideStatus.RIDE_STARTED: // 4
                    slug = 'ride_started';
                    break;
                case RideStatus.RIDE_COMPLETED: // 5
                    slug = 'ride_completed';
                    break;
            }

            if (slug) {
                // Run asynchronously, don't block response
                sendOrderStatusEmail(updatedOrder, slug);
            }
        }

        res.json(updatedOrder);
    } catch (error: any) {
        console.error('Update Order Error:', error);
        res.status(400).json({ message: 'Invalid update data', error: error.message });
    }
};

// @desc    Delete an order (Soft delete or set to CANCEL)
// @route   DELETE /api/orders/admin/:id
// @access  Private/Admin
export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (order) {
            order.status = RideStatus.DELETED;
            await order.save();
            res.json({ message: 'Order cancelled/removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        console.error('Delete Order Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... imports
import PaymentSettings from '../models/settings/payment-settings.model';

// ... existing code ...

// @desc    Get public order status (Public)
// @route   GET /api/orders/track/:id
// @access  Public
export const getPublicOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        let query: any = {};

        // Check if id is a valid ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            query._id = id;
        } else {
            // Otherwise assume it's a booking ID
            query.bookingId = id;
        }

        const order = await Order.findOne(query).select('status bookingId name carName tripStart tripEnd location createdAt paymentStatus payment finalPrice');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Fetch Payment Settings for context (e.g. VPA for manual)
        const paymentSettings = await PaymentSettings.getSingleton();

        // Safe response construction
        const responseData = {
            ...order.toObject(),
            activePaymentMethod: paymentSettings.activeMethod, // 1: Manual, 2: Razorpay
            merchantVpa: paymentSettings.manualPaymentDetails.upiId
        };



        res.json(responseData);
    } catch (error: any) {
        console.error('Get Public Order Status Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify Payment (Public/Redirect)
// @route   POST /api/orders/verify-payment
// @access  Public
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { paymentId, orderId } = req.body;

        if (!paymentId || !orderId) {
            return res.status(400).json({ message: 'Missing paymentId or orderId' });
        }

        // 1. Get Config
        const config = await getRazorpayConfig();
        if (!config.keyId || !config.keySecret) {
            return res.status(500).json({ message: 'Razorpay configuration missing' });
        }

        // 2. Fetch Payment Details from Razorpay
        const auth = Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64');
        const response = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        const paymentData = response.data;

        // 3. Verify Status
        if (paymentData.status === 'captured') {
            const order = await Order.findById(orderId);
            if (order) {
                if (order.paymentStatus !== 1) {
                    order.paymentStatus = 1; // Paid
                    if (order.payment) {
                        order.payment.transactionId = paymentId;
                    } else {
                        order.payment = { transactionId: paymentId };
                    }
                    await order.save();
                    console.log(`Order ${order._id} verified and updated to PAID via verifyPayment`);
                }
                return res.json({ success: true, message: 'Payment verified', status: 'captured' });
            } else {
                return res.status(404).json({ message: 'Order not found' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Payment not captured', status: paymentData.status });
        }

    } catch (error: any) {
        console.error('Verify Payment Error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Verification failed' });
    }
};
