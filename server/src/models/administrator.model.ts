import { Schema, Document, model, CallbackError } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import crypto from 'crypto';
import { status } from '../constants/status';

export interface IAdministrator extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    status: number;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    comparePassword(password: string): Promise<boolean>;
    getResetPasswordToken(): string;
}

const AdministratorSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'admin', required: true },
        status: { type: Number, default: status.active, required: true },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
    },
    { collection: 'administrator', timestamps: true }
);

// Hash password before saving
AdministratorSchema.pre('save', async function () {
    const admin = this as unknown as IAdministrator;
    if (!admin.isModified('password')) {
        return;
    }
    // No try/catch needed, async errors bubble up automatically
    admin.password = await hash(admin.password, 12);
});

// Method to compare password
AdministratorSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await compare(password, this.password);
};

// Generate and hash password reset token
AdministratorSchema.methods.getResetPasswordToken = function (): string {
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire time (e.g., 10 minutes)
    this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
};

const Administrator = model<IAdministrator>('Administrator', AdministratorSchema);

export default Administrator;
