import { Schema, Document, model } from 'mongoose';

export interface ICarSpecification extends Document {
    icon: string;
    text: string;
}

const CarSpecificationSchema = new Schema(
    {
        icon: { type: String, required: true },
        text: { type: String, required: true },
    },
    { collection: 'car_specifications', timestamps: true }
);

const CarSpecification = model<ICarSpecification>('CarSpecification', CarSpecificationSchema);

export default CarSpecification;
