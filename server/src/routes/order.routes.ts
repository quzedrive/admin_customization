import express from 'express';
import { createOrder, getAdminOrders, updateOrder, cancelOrder, getPublicOrderStatus } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Public: Create a new order
router.post('/', createOrder);

// Admin: Get all orders
router.get('/admin', protect, getAdminOrders);

// Admin: Update an order
router.put('/admin/:id', protect, updateOrder);

// Admin: Delete (cancel) an order
router.delete('/admin/:id', protect, cancelOrder);

// Public: Track order status
router.get('/track/:id', getPublicOrderStatus);

export default router;
