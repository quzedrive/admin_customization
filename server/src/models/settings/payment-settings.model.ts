import mongoose, { Document, Model, Schema } from 'mongoose';
import { PaymentMethod } from '../../constants/payment';

export interface IPaymentSettings extends Document {
    activeMethod: PaymentMethod;
    manualPaymentDetails: {
        accountName: string;
        upiId: string;
    };
    razorpayCredentials: {
        keyId: string;
        keySecret: string;
    };
}

interface IPaymentSettingsModel extends Model<IPaymentSettings> {
    getSingleton(): Promise<IPaymentSettings>;
}

const paymentSettingsSchema = new Schema<IPaymentSettings>(
    {
        activeMethod: {
            type: Number,
            enum: Object.values(PaymentMethod).filter((v) => typeof v === 'number'),
            default: PaymentMethod.MANUAL,
        },
        manualPaymentDetails: {
            accountName: { type: String, default: '' },
            upiId: { type: String, default: '' },
        },
        razorpayCredentials: {
            keyId: { type: String, default: '' },
            keySecret: { type: String, default: '' },
        },
    },
    { timestamps: true }
);

// Singleton Pattern
paymentSettingsSchema.statics.getSingleton = async function () {
    const settings = await this.findOne();
    if (settings) {
        return settings;
    }
    return await this.create({
        activeMethod: PaymentMethod.MANUAL,
        manualPaymentDetails: { accountName: '', upiId: '' },
        razorpayCredentials: { keyId: '', keySecret: '' },
    });
};

const PaymentSettings = mongoose.model<IPaymentSettings, IPaymentSettingsModel>('PaymentSettings', paymentSettingsSchema);

export default PaymentSettings;
