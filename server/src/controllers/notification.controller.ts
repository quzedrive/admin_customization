import { Request, Response } from 'express';
import Notification, { INotification } from '../models/notification.model';
import { NotificationStatus } from '../constants/notification';

// @desc    Get All Notifications
// @route   GET /api/notifications
// @access  Private/Admin
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const query = { status: { $ne: NotificationStatus.DELETED } };

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ status: NotificationStatus.NEW });

        res.json({
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            unreadCount
        });
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark Notification as Read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
export const markNotificationAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.status = NotificationStatus.READ;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error('Mark Notification Read Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark All as Read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
    try {
        await Notification.updateMany(
            { status: NotificationStatus.NEW },
            { $set: { status: NotificationStatus.READ } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark All Read Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete Notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.status = NotificationStatus.DELETED;
        await notification.save();

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Delete Notification Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
