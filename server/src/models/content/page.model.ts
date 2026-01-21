import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
    title: string;
    slug: string;
    content: string;
    status: number; // 0: Deleted, 1: Active, 2: Inactive
    createdAt: Date;
    updatedAt: Date;
}

const PageSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        content: { type: String, required: true }, // HTML content
        status: { type: Number, default: 1, enum: [0, 1, 2] },
    },
    { timestamps: true }
);

export default mongoose.model<IPage>('Page', PageSchema);
