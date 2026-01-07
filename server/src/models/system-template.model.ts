import { Schema, Document, model } from 'mongoose';
import { status } from '../constants/status';

export interface ISystemTemplate extends Document {
    name: string;
    slug: string;
    smsContent: string;
    pushBody: string;
    emailSubject: string;
    emailContent: string;
    status: number;
}

const SystemTemplateSchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        smsContent: { type: String, default: '' },
        pushBody: { type: String, default: '' },
        emailSubject: { type: String, default: '' },
        emailContent: { type: String, default: '' },
        status: { type: Number, default: status.active },
    },
    { collection: 'system_templates', timestamps: true }
);

const SystemTemplate = model<ISystemTemplate>('SystemTemplate', SystemTemplateSchema);

export default SystemTemplate;
