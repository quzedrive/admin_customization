import { Schema, Document, model } from 'mongoose';

export interface IEmailConfig extends Document {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
    fromEmail: string;
    fromName: string;
}

const EmailConfigSchema = new Schema<IEmailConfig>(
    {
        host: { type: String, default: '' },
        port: { type: Number, default: 587 },
        user: { type: String, default: '' },
        pass: { type: String, default: '' },
        secure: { type: Boolean, default: false },
        fromEmail: { type: String, default: '' },
        fromName: { type: String, default: '' },
    },
    { collection: 'email_config', timestamps: true }
);

// Ensure there's only one document (singleton)
EmailConfigSchema.statics.getSingleton = async function () {
    let config = await this.findOne();
    if (!config) {
        config = await this.create({});
    }
    return config;
};

const EmailConfig = model<IEmailConfig>('EmailConfig', EmailConfigSchema) as any;

export default EmailConfig;
