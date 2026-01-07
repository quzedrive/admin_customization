import { Schema, Document, model } from 'mongoose';
import { status } from '../constants/status';

export interface IBrand extends Document {
    name: string;
    slug: string;
    logo?: string;
    status: number; // 0: deleted, 1: active, 2: inactive
}

const BrandSchema = new Schema<IBrand>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        logo: { type: String },
        status: { type: Number, default: status.active, required: true },
    },
    { collection: 'brand', timestamps: true }
);

// Add partial unique index for slug where status is not 0 (deleted)
BrandSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 0 } } });

const Brand = model<IBrand>('Brand', BrandSchema);

export default Brand;

