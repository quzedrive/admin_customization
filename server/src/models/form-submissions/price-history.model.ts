import { Schema, Document, model, Types } from 'mongoose';

export interface IPriceHistory extends Document {
    order: Types.ObjectId;
    price: number;
    action: string; // e.g., 'created', 'updated', 'approved'
    status: number; // Snapshot of order status
    modifiedBy?: string; // Optional: Admin ID or 'System'
    note?: string; // Optional: Reason for change
    createdAt: Date;
}

const PriceHistorySchema = new Schema(
    {
        order: { type: Schema.Types.ObjectId, ref: 'Orders', required: true },
        price: { type: Number, required: true },
        action: { type: String, required: true },
        status: { type: Number, required: true },
        modifiedBy: { type: String },
        note: { type: String }
    },
    { timestamps: { createdAt: true, updatedAt: false } } // Only need creation time
);

const PriceHistory = model<IPriceHistory>('PriceHistory', PriceHistorySchema);

export default PriceHistory;
