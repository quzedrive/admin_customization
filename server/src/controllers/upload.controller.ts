import { Request, Response } from 'express';

// @desc    Upload a single file to S3
// @route   POST /api/upload
// @access  Private/Admin
export const uploadFile = (req: Request, res: Response) => {
    if (req.file) {
        // multer-s3 adds 'location' and 'key' to req.file
        const file = req.file as any;
        console.log('Uploaded File Object:', file); // DEBUG: Inspect Cloudinary response

        res.status(200).json({
            message: 'File uploaded successfully',
            // Cloudinary often uses 'secure_url' or 'path'. S3 uses 'location'.
            url: file.secure_url || file.path || file.location || file.url,
            key: file.filename || file.key || file.public_id,
            mimetype: file.mimetype,
            size: file.size
        });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
};
