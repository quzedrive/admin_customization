import { Schema, Document, model, Types } from 'mongoose';

export interface ICarPackage extends Document {
    car: Types.ObjectId;
    package: Types.ObjectId;
    price: number;
    isActive: boolean;
    isAvailable: boolean;
}

const CarPackageSchema = new Schema(
    {
        car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
        package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
        price: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        isAvailable: { type: Boolean, default: true },
    },
    { collection: 'car_packages', timestamps: true }
);

const CarPackage = model<ICarPackage>('CarPackage', CarPackageSchema);

export default CarPackage;
