import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
    getSettings,
    updateGeneral,
    updateContact,
    updateSocial,
    updateSeo,
    updateMaintenance,
    updateBaseTiming
} from '../controllers/site-settings.controller';

const router = Router();

// Public Get
router.get('/', getSettings);

// Protected Updates
router.put('/general', protect, updateGeneral);
router.put('/contact', protect, updateContact);
router.put('/social', protect, updateSocial);
router.put('/seo', protect, updateSeo);
router.put('/maintenance', protect, updateMaintenance);
router.put('/base-timing', protect, updateBaseTiming);

export default router;
