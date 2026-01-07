import express from 'express';
import { upload } from '../middlewares/upload.middleware';
import { uploadFile } from '../controllers/upload.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Upload route
// Uses 'file' as the form-data key
router.post('/', protect, upload.single('file'), uploadFile);

export default router;
