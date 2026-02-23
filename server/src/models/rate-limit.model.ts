import mongoose, { Schema, Document } from 'mongoose';

export interface IRateLimit extends Document {
    key: string;      // Usually IP address + route/prefix
    hits: number;
    resetTime: Date;
}

const RateLimitSchema: Schema = new Schema({
    key: { type: String, required: true, unique: true },
    hits: { type: Number, default: 0 },
    resetTime: { type: Date, required: true }
}, {
    timestamps: true
});

// Index to automatically delete expired rate limit records
RateLimitSchema.index({ resetTime: 1 }, { expireAfterSeconds: 0 });

export const RateLimit = mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);
