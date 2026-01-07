import { Schema, Document, model } from 'mongoose';

export interface IImageUploadConfig extends Document {
    provider: string; // 'cloudinary', 's3', 'local', etc.
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
}

const ImageUploadConfigSchema = new Schema<IImageUploadConfig>(
    {
        provider: { type: String, default: 'cloudinary' },
        cloudinary: {
            cloudName: { type: String, default: '' },
            apiKey: { type: String, default: '' },
            apiSecret: { type: String, default: '' },
        },
    },
    { collection: 'image_upload_config', timestamps: true }
);

// Ensure there's only one document (singleton)
ImageUploadConfigSchema.statics.getSingleton = async function () {
    let config = await this.findOne();
    if (!config) {
        config = await this.create({});
    }
    return config;
};

const ImageUploadConfig = model<IImageUploadConfig>('ImageUploadConfig', ImageUploadConfigSchema) as any;

export default ImageUploadConfig;
