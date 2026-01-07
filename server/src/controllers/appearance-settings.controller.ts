import { Request, Response } from 'express';
import AppearanceSettings from '../models/settings/appearance-settings.model';

// @desc    Get appearance settings
// @route   GET /api/settings/appearance
// @access  Public (or Private based on requirement, usually public for frontend rendering)
export const getAppearanceSettings = async (req: Request, res: Response) => {
    try {
        const config = await AppearanceSettings.getSingleton();
        res.status(200).json(config);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch appearance settings', error: error.message });
    }
};

// @desc    Update appearance settings
// @route   PUT /api/settings/appearance
// @access  Private/Admin
export const updateAppearanceSettings = async (req: Request, res: Response) => {
    try {
        const config = await AppearanceSettings.getSingleton();
        const { primaryColor, secondaryColor, iconColor } = req.body;

        config.primaryColor = primaryColor ?? config.primaryColor;
        config.secondaryColor = secondaryColor ?? config.secondaryColor;
        config.iconColor = iconColor ?? config.iconColor;

        await config.save();
        res.status(200).json(config);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update appearance settings', error: error.message });
    }
};
