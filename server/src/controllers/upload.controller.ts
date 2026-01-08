import { Request, Response } from 'express';

// @desc    Upload a single file to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadFile = (req: Request, res: Response) => {
    try {
        if (req.file) {
            // multer-storage-cloudinary adds Cloudinary-specific properties
            const file = req.file as any;
            console.log('Uploaded File Object:', file); // DEBUG: Inspect Cloudinary response

            // Check if upload was successful
            if (!file.path && !file.secure_url && !file.location) {
                console.error('Upload failed - no URL in file object:', file);
                res.status(500).json({
                    message: 'File upload failed - no URL returned from storage',
                    details: 'Cloudinary may not be properly configured'
                });
                return;
            }

            res.status(200).json({
                message: 'File uploaded successfully',
                // Cloudinary uses 'secure_url' or 'path'. S3 uses 'location'.
                url: file.secure_url || file.path || file.location || file.url,
                key: file.filename || file.key || file.public_id,
                mimetype: file.mimetype,
                size: file.size
            });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (error: any) {
        console.error('Upload controller error:', error);
        res.status(500).json({
            message: 'File upload failed',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
