import { Schema, Document, model, Types } from 'mongoose';
import { status } from '../../constants/status';

export interface ICarPackage {
    package: Types.ObjectId;
    price: number;
    isActive: boolean; // car active or not for the particular package
}


export interface ICar extends Document {
    brand: string;
    name: string;
    slug: string;
    type: string;
    transmission: string;
    fuelType: string;
    seatingCapacity: number;
    basePrice: number;
    hourlyCharge: number;
    additionalHourlyCharge: number;
    images: Types.ObjectId[];
    packages: ICarPackage[];
    description: string;
    specifications: Types.ObjectId[];
    host: {
        type: number; // 1: Self Hosted, 2: Attachment
        details?: {
            name: string;
            email: string;
            phone: string;
            aadhar?: string;
        };
    };
    status: number;
    featured: number;
}

const CarSchema = new Schema(
    {
        brand: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        type: { type: String, required: true }, // e.g. Sedan, SUV
        transmission: { type: String, required: true }, // e.g. Automatic, Manual
        fuelType: { type: String, required: true }, // e.g. Petrol, Diesel, Electric
        seatingCapacity: { type: Number, required: true },
        basePrice: { type: Number, required: true },
        hourlyCharge: { type: Number, required: true },
        additionalHourlyCharge: { type: Number, required: true },
        images: [{ type: Schema.Types.ObjectId, ref: 'CarImage' }],
        packages: [{ type: Schema.Types.ObjectId, ref: 'CarPackage' }],
        description: { type: String, default: '' },
        specifications: [{ type: Schema.Types.ObjectId, ref: 'CarSpecification' }],
        host: {
            type: { type: Number, required: true, enum: [1, 2], default: 1 }, // 1: Self Hosted, 2: Attachment
            details: {
                name: {
                    type: String,
                    required: function (this: any) { return this.host.type === 2; }
                },
                email: {
                    type: String,
                    required: function (this: any) { return this.host.type === 2; }
                },
                phone: {
                    type: String,
                    required: function (this: any) { return this.host.type === 2; }
                },
                aadhar: { type: String }
            }
        },
        status: { type: Number, default: status.active },
        featured: { type: Number, default: 2 }, // Default to Inactive (2) based on featuredStatus
    },
    { collection: 'cars', timestamps: true }
);

// Unique index on slug, only for non-deleted documents
CarSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 0 } } });

const Car = model<ICar>('Car', CarSchema);

export default Car;
