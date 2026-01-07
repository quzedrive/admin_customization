import { Schema, Document, model } from 'mongoose';
import { status } from '../constants/status';

export interface IPackage extends Document {
    name: string;
    time: string;
    image?: string;
    status: number; // 0: deleted, 1: active, 2: inactive
}

const PackageSchema = new Schema<IPackage>(
    {
        name: { type: String, required: true }, // Removed unique: true
        time: { type: String, required: true },
        image: { type: String },
        status: { type: Number, default: status.active, required: true },
    },
    { collection: 'package', timestamps: true }
);

// Partial index: name must be unique only if status is NOT 0 (deleted)
PackageSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 0 } } });

const Package = model<IPackage>('Package', PackageSchema);

export default Package;
