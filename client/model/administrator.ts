import { Schema, Document, models, model, Model } from 'mongoose';
import { hash, compare } from 'bcryptjs';

import { status } from '@/types/status';

export interface IAdministrator extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    status: number;
    comparePassword(password: string): Promise<boolean>;
}

const AdministratorSchema = new Schema<IAdministrator>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'admin', required: true },
        status: { type: Number, default: status.active, required: true },
    },
    { collection: 'administrator', timestamps: true }
);

// Hash password before saving
AdministratorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await hash(this.password, 12);
        next();
    } catch (error) {
        next(error as Error); // Cast error to ensure type compatibility
    }
});

// Method to compare password
AdministratorSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await compare(password, this.password);
};

const Administrator = (models.Administrator as Model<IAdministrator>) || model<IAdministrator>('Administrator', AdministratorSchema);

export default Administrator;
