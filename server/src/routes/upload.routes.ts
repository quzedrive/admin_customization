import express from 'express';
import { upload } from '../middlewares/upload.middleware';
import { uploadFile } from '../controllers/upload.controller';
import { protect } from '../middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Upload route
// Uses 'file' as the form-data key
router.post('/', protect, (req: Request, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err: any) => {
        if (err) {
            console.error('Multer/Upload error:', err);
            return res.status(400).json({
                message: 'File upload failed',
                error: err.message,
                details: err.code || 'Unknown error'
            });
        }
        next();
    });
}, uploadFile);

export default router;
