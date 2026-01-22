import PriceHistory from '../models/form-submissions/price-history.model';
import { getRazorpayConfig } from '../config/razorpay';
import { Request, Response } from 'express';
import Order from '../models/form-submissions/order.model';
import Car from '../models/cars/car.model';
import { RideStatus } from '../constants/ride';
import SystemTemplate from '../models/system-template.model';
import EmailConfig from '../models/email-config.model';
import sendEmail from '../utils/sendEmail';
import { status } from '../constants/status';
import axios from 'axios';

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
            const replacer = (text: string) => text
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
                .replace(/{{link}}/g, `${process.env.FRONTEND_URL || 'http://localhost:3000'}/track?id=${bookingId}`)
                .replace(/{{adminLink}}/g, `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/order-management/edit-page/${order._id}`);

            emailContent = replacer(emailContent);

            // Send Email to User
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
            }

            // --- ADMIN NOTIFICATION ---
            try {
                console.log('Fetching system template: admin_new_order');
                const adminTemplate = await SystemTemplate.findOne({ slug: 'admin_new_order' });

                if (adminTemplate && adminTemplate.status === status.active) {
                    let adminContent = adminTemplate.emailContent;
                    const adminSubject = adminTemplate.emailSubject.replace(/{{orderId}}/g, bookingId);

                    adminContent = replacer(adminContent);

                    // Get Admin Email
                    const adminEmail = siteSettings?.contact?.email || 'nilemaxi@gmail.com'; // Fallback

                    console.log('Sending New Order Notification to Admin:', adminEmail);
                    await sendEmail({
                        email: adminEmail,
                        subject: adminSubject,
                        message: `New Order Received: ${bookingId}`,
                        html: adminContent
                    });
                    console.log('Admin notification sent successfully');
                } else {
                    console.log('Admin template (admin_new_order) not found or inactive. Skipping admin email.');
                }
            } catch (adminErr) {
                console.error('Failed to send admin notification:', adminErr);
            }

            // --- HOST NOTIFICATION ---
            try {
                if (carSlug || carName) {
                    const carQuery = carSlug ? { slug: carSlug } : { name: carName };
                    const car = await Car.findOne(carQuery).select('host');

                    if (car && car.host && car.host.type === 2 && car.host.details?.email) {
                        const hostEmail = car.host.details.email;
                        console.log('Fetching system template: host_new_order');

                        const hostTemplate = await SystemTemplate.findOne({ slug: 'host_new_order' });

                        if (hostTemplate && hostTemplate.status === status.active) {
                            let hostContent = hostTemplate.emailContent;
                            const hostSubject = hostTemplate.emailSubject.replace(/{{orderId}}/g, bookingId);

                            hostContent = replacer(hostContent);

                            console.log('Sending New Order Notification to Host:', hostEmail);
                            await sendEmail({
                                email: hostEmail,
                                subject: hostSubject,
                                message: `New Order Received for your car: ${bookingId}`,
                                html: hostContent
                            });
                            console.log('Host notification sent successfully');
                        } else {
                            console.log('Host template (host_new_order) not found or inactive. Skipping host email.');
                        }
                    }
                }
            } catch (hostErr) {
                console.error('Failed to send host notification:', hostErr);
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

            // --- REPLACER FUNCTION ---
            const startDate = new Date(order.tripStart).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
            const emailConfig = await EmailConfig.getSingleton();
            const year = new Date().getFullYear().toString();
            const companyName = emailConfig.fromName || 'Quzee Drive';
            const supportEmail = emailConfig.fromEmail || 'support@quzeedrive.com';
            const orderLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/track?id=${order.bookingId || order._id}`;
            const adminLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/order-management/edit-page/${order._id}`;
            const submissionTime = new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

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
                .replace(/{{adminLink}}/g, adminLink)
                .replace(/{{cancelReason}}/g, order.cancelReason || '')
                .replace(/{{finalPrice}}/g, order.finalPrice ? order.finalPrice.toString() : (order.selectedPackage ? order.selectedPackage.replace(/[^0-9]/g, '') : ''))
                .replace(/{{submissionTime}}/g, submissionTime);

            let mainContent = replacer(emailContent);


            // --- PDF Generation Logic ---
            let attachments: any[] = [];
            if (slug === 'order_confirmed') {
                try {
                    const agreementTemplate = await SystemTemplate.findOne({ slug: 'rental_agreement' });
                    if (agreementTemplate && agreementTemplate.status === status.active) {
                        const agreementHtml = replacer(agreementTemplate.emailContent);
                        const pdfBuffer = await generatePDF(agreementHtml);
                        attachments.push({
                            filename: `Rental_Agreement_${order.bookingId || order._id}.pdf`,
                            content: pdfBuffer,
                            contentType: 'application/pdf'
                        });
                    }
                } catch (pdfError) {
                    console.error('Failed to generate PDF Agreement:', pdfError);
                }
            }

            // --- Payment Details Generation (QR or Link) ---
            let extraContent = '';
            if (slug === 'order_confirmed') {
                let paymentDetails;

                // Check if valid link already exists for Razorpay
                if (order.payment?.link && order.payment?.linkId) {
                    paymentDetails = {
                        type: 'link',
                        paymentLink: order.payment.link,
                        paymentLinkId: order.payment.linkId,
                        amount: order.finalPrice || 0
                    };
                } else {
                    paymentDetails = await generatePaymentDetails(order);
                    if (paymentDetails.type === 'link' && paymentDetails.paymentLink) {
                        try {
                            await Order.findByIdAndUpdate(order._id, {
                                'payment.link': paymentDetails.paymentLink,
                                'payment.linkId': paymentDetails.paymentLinkId
                            });
                        } catch (saveError) { console.error(saveError); }
                    }
                }

                if (paymentDetails.type === 'qr' && paymentDetails.qrBuffer && paymentDetails.vpa) {
                    attachments.push({
                        filename: `payment_qr.png`,
                        content: paymentDetails.qrBuffer,
                        contentType: 'image/png',
                        cid: 'payment_qr'
                    });
                    extraContent = `
                        <div style="margin: 20px 0; text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                            <h3 style="margin-top: 0; color: #333;">Complete Your Payment</h3>
                            <p><strong>Scan to Pay ₹${paymentDetails.amount}</strong></p>
                            <img src="cid:payment_qr" alt="Payment QR Code" style="width: 200px; height: 200px; margin: 10px auto;" />
                            <p style="font-size: 14px; color: #666; margin-bottom: 5px;">UPI ID: <strong>${paymentDetails.vpa}</strong></p>
                            <p style="font-size: 12px; color: #999;">Scan using any UPI App (GPay, PhonePe, Paytm)</p>
                        </div>
                    `;
                }
                else if (paymentDetails.type === 'link' && paymentDetails.paymentLink) {
                    extraContent = `
                        <div style="margin: 20px 0; text-align: center; padding: 20px; background-color: #f0f7ff; border-radius: 8px; border: 1px solid #cce5ff;">
                            <h3 style="margin-top: 0; color: #004085;">Complete Your Payment</h3>
                            <p style="color: #004085; margin-bottom: 20px;">Please click the button below to pay ₹${paymentDetails.amount} securely via Razorpay.</p>
                            <a href="${paymentDetails.paymentLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Pay Now</a>
                            <p style="font-size: 12px; color: #666; margin-top: 15px;">Link expires in 15 minutes.</p>
                        </div>
                    `;
                }
            }

            // Inject extra content into main template if placeholder exists, else append
            if (mainContent.includes('{{paymentDetails}}')) {
                mainContent = mainContent.replace('{{paymentDetails}}', extraContent);
            } else {
                mainContent += extraContent;
            }


            // 1. Send to Customer
            console.log('Sending email to Customer:', order.email);
            await sendEmail({
                email: order.email,
                subject: subject,
                message: `${slug.replace('_', ' ').toUpperCase()}: ${order.bookingId || order._id}`,
                html: mainContent,
                attachments
            });


            // 2. Send to Admin (Check for specific template first)
            const siteSettings = await SiteSettings.findOne();
            const adminEmail = siteSettings?.contact.email || "nilemaxi@gmail.com";

            let adminHtml = mainContent; // Default to user content
            let adminSubject = `[ADMIN COPY] ${subject}`;

            try {
                const adminSlug = `admin_${slug}`;
                const adminTemplate = await SystemTemplate.findOne({ slug: adminSlug });
                if (adminTemplate && adminTemplate.status === status.active) {
                    console.log(`Found specific admin template: ${adminSlug}`);
                    adminHtml = replacer(adminTemplate.emailContent);
                    adminSubject = adminTemplate.emailSubject.replace(/{{orderId}}/g, (order.bookingId || order._id.toString().slice(-6)).toUpperCase());
                    // Inject extra content if needed (payment details usually not needed for admin, unless specified)
                    if (adminHtml.includes('{{paymentDetails}}')) {
                        // Admin probably doesn't need to pay, but we replace if placeholder exists to avoid showing raw tag
                        adminHtml = adminHtml.replace('{{paymentDetails}}', '');
                    }
                }
            } catch (e) {
                console.log('Error fetching specific admin template, falling back to default copy');
            }

            console.log('Sending email to Admin:', adminEmail);
            await sendEmail({
                email: adminEmail,
                subject: adminSubject,
                message: `Update for Order #${order.bookingId}`,
                html: adminHtml,
                attachments
            });


            // 3. Send to Host
            if (order.carSlug || order.carName) {
                try {
                    const carQuery = order.carSlug ? { slug: order.carSlug } : { name: order.carName };
                    const car = await Car.findOne(carQuery).select('host');

                    if (car && car.host && car.host.type === 2 && car.host.details?.email) {
                        const hostEmail = car.host.details.email;

                        let hostHtml = mainContent;
                        let hostSubject = `[HOST NOTIFICATION] ${subject}`;

                        try {
                            const hostSlug = `host_${slug}`;
                            const hostTemplate = await SystemTemplate.findOne({ slug: hostSlug });
                            if (hostTemplate && hostTemplate.status === status.active) {
                                console.log(`Found specific host template: ${hostSlug}`);
                                hostHtml = replacer(hostTemplate.emailContent);
                                hostSubject = hostTemplate.emailSubject.replace(/{{orderId}}/g, (order.bookingId || order._id.toString().slice(-6)).toUpperCase());
                                if (hostHtml.includes('{{paymentDetails}}')) {
                                    hostHtml = hostHtml.replace('{{paymentDetails}}', '');
                                }
                            }
                        } catch (e) {
                            console.log('Error fetching specific host template, falling back to default copy');
                        }

                        console.log('Sending email to Host:', hostEmail);
                        await sendEmail({
                            email: hostEmail,
                            subject: hostSubject,
                            message: `Notification for your car: ${order.carName}`,
                            html: hostHtml,
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
        const oldPrice = order.finalPrice;

        Object.assign(order, updates);
        const updatedOrder = await order.save();

        const newStatus = updatedOrder.status;

        // Track Price History if price changed or status changed to Approved
        if (updates.finalPrice !== undefined && updates.finalPrice !== oldPrice) {
            await PriceHistory.create({
                order: order._id,
                price: updates.finalPrice,
                action: (newStatus === RideStatus.APPROVE) ? 'approved' : 'updated',
                status: newStatus,
                note: `Price updated from ${oldPrice || 'N/A'} to ${updates.finalPrice}`
            });
        }
        // Also track if status changed to Approved (even if price didn't change, effectively "confirming" the price)
        else if (newStatus === RideStatus.APPROVE && oldStatus !== RideStatus.APPROVE) {
            await PriceHistory.create({
                order: order._id,
                price: updatedOrder.finalPrice || 0,
                action: 'approved',
                status: newStatus,
                note: `Order approved with price ${updatedOrder.finalPrice}`
            });
        }

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

// @desc    Get Price History for an Order
// @route   GET /api/orders/:id/price-history
// @access  Private/Admin
export const getPriceHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const history = await PriceHistory.find({ order: id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error: any) {
        console.error('Get Price History Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
