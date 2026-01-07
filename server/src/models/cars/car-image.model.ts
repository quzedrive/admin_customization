import { Schema, Document, model } from 'mongoose';

export interface ICarImage extends Document {
    url: string;
    order: number;
}

const CarImageSchema = new Schema(
    {
        url: { type: String, required: true },
        order: { type: Number, default: 0 },
    },
    { collection: 'car_images', timestamps: true }
);

const CarImage = model<ICarImage>('CarImage', CarImageSchema);

export default CarImage;
