import { status } from '@/types/status';
import { Schema, Document, models, model, Model } from 'mongoose';

export interface IBrand extends Document {
    name: string;
    slug: string;
    logo?: string;
    status: number; // 0: deleted, 1: active, 2: inactive
}

const BrandSchema = new Schema<IBrand>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        logo: { type: String },
        status: { type: Number, default: status.active, required: true },
    },
    { collection: 'brand', timestamps: true }
);

const Brand = (models.Brand as Model<IBrand>) || model<IBrand>('Brand', BrandSchema);

export default Brand;
