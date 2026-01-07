import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { getImageUploadConfig, updateImageUploadConfig } from '../controllers/image-upload-config.controller';

const router = express.Router();

// GET /api/settings/image-upload
router.get('/', protect, getImageUploadConfig);

// PUT /api/settings/image-upload
router.put('/', protect, updateImageUploadConfig);

export default router;
