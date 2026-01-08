import { Request, Response } from 'express';
import Administrator from '../models/administrator.model';

// @desc    Update profile image
// @route   PUT /api/admin/profile/image
// @access  Private
export const updateProfileImage = async (req: any, res: Response) => {
    try {
        const admin = await Administrator.findById(req.admin._id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // req.file comes from multer middleware
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const imageUrl = req.file.secure_url || req.file.path || req.file.location || req.file.url;

        if (!imageUrl) {
            return res.status(500).json({ message: 'File upload failed - no URL returned' });
        }

        admin.profileImage = imageUrl;
        await admin.save();

        res.json({
            message: 'Profile image updated successfully',
            profileImage: admin.profileImage
        });
    } catch (error: any) {
        console.error('Update profile image error:', error);
        res.status(500).json({ message: 'Failed to update profile image', error: error.message });
    }
};

// @desc    Delete profile image
// @route   DELETE /api/admin/profile/image
// @access  Private
export const deleteProfileImage = async (req: any, res: Response) => {
    try {
        const admin = await Administrator.findById(req.admin._id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.profileImage = '';
        await admin.save();

        res.json({ message: 'Profile image deleted successfully' });
    } catch (error: any) {
        console.error('Delete profile image error:', error);
        res.status(500).json({ message: 'Failed to delete profile image', error: error.message });
    }
};
