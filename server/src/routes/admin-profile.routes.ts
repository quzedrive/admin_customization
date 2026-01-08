import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { updateProfileImage, deleteProfileImage } from '../controllers/admin-profile.controller';

const router = Router();

router.put('/image', protect, upload.single('file'), updateProfileImage);
router.delete('/image', protect, deleteProfileImage);

export default router;
