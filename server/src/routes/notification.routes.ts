import express from 'express';
import { protect, admin } from '../middlewares/auth.middleware';
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from '../controllers/notification.controller';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/', getNotifications);
router.put('/:id/read', markNotificationAsRead);
router.put('/read-all', markAllNotificationsAsRead);
router.delete('/:id', deleteNotification);

export default router;
