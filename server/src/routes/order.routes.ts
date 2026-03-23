import express from 'express';
import { createOrder, getAdminOrders, updateOrder, cancelOrder, getPublicOrderStatus, verifyPayment, getPriceHistory, resendOrderEmail } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';
import { trackOrderLimiter } from '../middlewares/rate-limiter.middleware';

const router = express.Router();

// Public: Create a new order
router.post('/', createOrder);

// Admin: Get all orders
router.get('/admin', protect, getAdminOrders);

// Admin: Update an order
router.put('/admin/:id', protect, updateOrder);

// Admin: Resend Email
router.post('/admin/:id/resend-email', protect, resendOrderEmail);

// Admin: Delete (cancel) an order
router.delete('/admin/:id', protect, cancelOrder);

// Admin: Get Price History
router.get('/:id/price-history', protect, getPriceHistory);

// Public: Track order status
router.get('/track/:id', trackOrderLimiter, getPublicOrderStatus);

// Public: Verify Payment (called after redirect)
router.post('/verify-payment', verifyPayment);

export default router;
