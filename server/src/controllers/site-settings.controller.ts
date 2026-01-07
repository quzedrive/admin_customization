import { Request, Response } from 'express';
import SiteSettings from '../models/settings/site-settings.model';

// Helper to get the single settings document
const getSettingsDocument = async () => {
    let settings = await SiteSettings.findOne();
    if (!settings) {
        settings = await SiteSettings.create({});
    }
    return settings;
};

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public (or Private depending on needs, usually public for frontend)
export const getSettings = async (req: Request, res: Response) => {
    try {
        const settings = await getSettingsDocument();
        res.status(200).json(settings);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
    }
};

// @desc    Update General Section (Identity + Logos)
// @route   PUT /api/settings/general
// @access  Private/Admin
export const updateGeneral = async (req: Request, res: Response) => {
    try {
        console.log('Update General Body:', req.body); // DEBUG LOG
        const settings = await getSettingsDocument();
        const { siteTitle, description, keywords, lightLogo, darkLogo, favicon } = req.body;

        settings.general = {
            ...settings.general,
            siteTitle: siteTitle ?? settings.general.siteTitle,
            description: description ?? settings.general.description,
            keywords: keywords ?? settings.general.keywords,
            lightLogo: lightLogo ?? settings.general.lightLogo,
            darkLogo: darkLogo ?? settings.general.darkLogo,
            favicon: favicon ?? settings.general.favicon,
        };

        await settings.save();
        res.status(200).json(settings.general);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update general settings', error: error.message });
    }
};

// @desc    Update Contact Section
// @route   PUT /api/settings/contact
// @access  Private/Admin
export const updateContact = async (req: Request, res: Response) => {
    try {
        const settings = await getSettingsDocument();
        const { email, phone, address, mapUrl } = req.body;

        settings.contact = {
            ...settings.contact,
            email: email ?? settings.contact.email,
            phone: phone ?? settings.contact.phone,
            address: address ?? settings.contact.address,
            mapUrl: mapUrl ?? settings.contact.mapUrl,
        };

        await settings.save();
        res.status(200).json(settings.contact);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update contact settings', error: error.message });
    }
};

// @desc    Update Social Section
// @route   PUT /api/settings/social
// @access  Private/Admin
export const updateSocial = async (req: Request, res: Response) => {
    try {
        const settings = await getSettingsDocument();
        const { facebook, twitter, instagram, linkedin, youtube } = req.body;

        settings.social = {
            ...settings.social,
            facebook: facebook ?? settings.social.facebook,
            twitter: twitter ?? settings.social.twitter,
            instagram: instagram ?? settings.social.instagram,
            linkedin: linkedin ?? settings.social.linkedin,
            youtube: youtube ?? settings.social.youtube,
        };

        await settings.save();
        res.status(200).json(settings.social);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update social settings', error: error.message });
    }
};

// @desc    Update SEO Section
// @route   PUT /api/settings/seo
// @access  Private/Admin
export const updateSeo = async (req: Request, res: Response) => {
    try {
        const settings = await getSettingsDocument();
        const { metaTitle, metaDescription, ogImage } = req.body;

        settings.seo = {
            ...settings.seo,
            metaTitle: metaTitle ?? settings.seo.metaTitle,
            metaDescription: metaDescription ?? settings.seo.metaDescription,
            ogImage: ogImage ?? settings.seo.ogImage,
        };

        await settings.save();
        res.status(200).json(settings.seo);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update SEO settings', error: error.message });
    }
};

// @desc    Update Maintenance Section
// @route   PUT /api/settings/maintenance
// @access  Private/Admin
export const updateMaintenance = async (req: Request, res: Response) => {
    try {
        const settings = await getSettingsDocument();
        const { status, title, message } = req.body;

        settings.maintenance = {
            ...settings.maintenance,
            status: status !== undefined ? status : settings.maintenance.status,
            title: title ?? settings.maintenance.title,
            message: message ?? settings.maintenance.message,
        };

        await settings.save();
        res.status(200).json(settings.maintenance);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update maintenance settings', error: error.message });
    }
};
