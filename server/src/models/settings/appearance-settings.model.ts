import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAppearanceSettings extends Document {
    primaryColor: string;
    secondaryColor: string;
    iconColor: string;
    // Add more appearance settings here as needed (e.g., radius, font)
}

interface IAppearanceSettingsModel extends Model<IAppearanceSettings> {
    getSingleton(): Promise<IAppearanceSettings>;
}

const appearanceSettingsSchema = new Schema<IAppearanceSettings>(
    {
        primaryColor: { type: String, default: '#2563eb' }, // Default blue-600
        secondaryColor: { type: String, default: '#4f46e5' }, // Default indigo-600
        iconColor: { type: String, default: '#3b82f6' }, // Default blue-500
    },
    { timestamps: true }
);

// Static method to get the singleton instance
appearanceSettingsSchema.statics.getSingleton = async function () {
    let config = await this.findOne();
    if (!config) {
        config = await this.create({});
    }
    return config;
};

const AppearanceSettings = mongoose.model<IAppearanceSettings, IAppearanceSettingsModel>('AppearanceSettings', appearanceSettingsSchema);

export default AppearanceSettings;
