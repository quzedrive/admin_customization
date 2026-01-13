import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { getDashboardStats, getDashboardAnalytics } from '../controllers/dashboard.controller';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/analytics', protect, getDashboardAnalytics);

export default router;
