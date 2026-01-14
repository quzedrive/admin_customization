import { Schema, Document, model } from 'mongoose';
import { NotificationStatus } from '../constants/notification';

export interface INotification extends Document {
    title: string;
    message: string;
    type: 'order' | 'system' | 'alert';
    link?: string;
    status: number; // 0: Deleted, 1: Read, 2: New
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ['order', 'system', 'alert'], default: 'system' },
        link: { type: String },
        status: {
            type: Number,
            default: NotificationStatus.NEW,
            enum: Object.values(NotificationStatus)
        },
    },
    { timestamps: true }
);

// Indexes
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ status: 1 });

const Notification = model<INotification>('Notification', NotificationSchema);

export default Notification;
