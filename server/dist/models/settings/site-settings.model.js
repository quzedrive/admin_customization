"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SiteSettingsSchema = new mongoose_1.Schema({
    general: {
        siteTitle: { type: String, default: 'My Website' },
        description: { type: String, default: '' },
        keywords: { type: String, default: '' },
        lightLogo: { type: String, default: '' },
        darkLogo: { type: String, default: '' },
        favicon: { type: String, default: '' },
    },
    contact: {
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
        mapUrl: { type: String, default: '' },
    },
    social: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        youtube: { type: String, default: '' },
    },
    seo: {
        metaTitle: { type: String, default: '' },
        metaDescription: { type: String, default: '' },
        ogImage: { type: String, default: '' },
    },
    maintenance: {
        status: { type: Number, default: 2 }, // Default 2 (Inactive)
        title: { type: String, default: 'We will be back soon!' },
        message: { type: String, default: 'We are currently under maintenance. Please try again later.' },
    },
}, { collection: 'site_settings', timestamps: true });
// Index for fast maintenance checks (e.g., middleware checks)
SiteSettingsSchema.index({ 'maintenance.status': 1 });
// Ensure only one document exists (Optional: Logic can be handled in controller)
const SiteSettings = (0, mongoose_1.model)('SiteSettings', SiteSettingsSchema);
exports.default = SiteSettings;
