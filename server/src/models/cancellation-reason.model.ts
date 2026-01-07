import mongoose, { Schema, Document } from 'mongoose';

export interface ICancellationReason extends Document {
    reason: string;
    status: number; // 1 = Active, 2 = Inactive, 0 = Deleted
    createdAt: Date;
    updatedAt: Date;
}

const CancellationReasonSchema: Schema = new Schema({
    reason: { type: String, required: true },
    status: { type: Number, default: 1 }, // 1 = Active, 2 = Inactive, 0 = Deleted
}, {
    timestamps: true,
    collection: 'cancellation_reason'
});

export default mongoose.model<ICancellationReason>('CancellationReason', CancellationReasonSchema);
