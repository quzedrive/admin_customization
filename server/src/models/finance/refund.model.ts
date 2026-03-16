import { Schema, Document, model, Types } from 'mongoose';

export interface IRefund extends Document {
    order: Types.ObjectId;
    amount: number;
    method: number; // 1: Manual, 2: Razorpay
    status: number; // 0: None, 1: Pending, 2: Processed, 3: Failed
    transactionId?: string;
    reason?: string;
    reasonId?: Types.ObjectId;
    processedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const RefundSchema = new Schema(
    {
        order: { type: Schema.Types.ObjectId, ref: 'Orders', required: true },
        amount: { type: Number, required: true },
        method: { type: Number, required: true },
        status: { type: Number, default: 1 }, // Default to Pending
        transactionId: { type: String },
        reason: { type: String },
        reasonId: { type: Schema.Types.ObjectId, ref: 'CancellationReason' },
        processedAt: { type: Date, default: Date.now },
    },
    { collection: 'refunds', timestamps: true }
);

const Refund = model<IRefund>('Refund', RefundSchema);

export default Refund;
