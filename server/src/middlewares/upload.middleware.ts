import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config';

// File Filter
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMimeTypes = [
        // Images
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon',
        // Videos
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm',
        // Documents
        'application/pdf'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
    }
};

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file: any) => {
        try {
            // Determine folder from query param, default to 'uploads/misc'
            const folder = req.query.folder ? `uploads/${req.query.folder}` : 'uploads/misc';

            // Determine resource_type
            let resourceType = 'auto';
            if (file.mimetype.startsWith('image/')) {
                resourceType = 'image';
            } else if (file.mimetype.startsWith('video/')) {
                resourceType = 'video';
            }

            console.log(`[Upload] Processing file: ${file.originalname}`);
            console.log(`[Upload] Folder: ${folder}, Type: ${resourceType}`);

            return {
                folder: folder,
                resource_type: resourceType,
                public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
                format: file.mimetype === 'image/svg+xml' ? 'svg' : undefined, // Explicitly set format for SVG
            };
        } catch (error) {
            console.error('[Upload] Error in storage params:', error);
            throw error;
        }
    },
});

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

