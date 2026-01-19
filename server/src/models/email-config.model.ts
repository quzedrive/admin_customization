import { Schema, Document, model } from 'mongoose';

export interface IEmailConfig extends Document {
    apiKey: string;
    apiSecret: string;
    fromEmail: string;
    fromName: string;
}

const EmailConfigSchema = new Schema<IEmailConfig>(
    {
        apiKey: { type: String, default: '' },
        apiSecret: { type: String, default: '' },
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
