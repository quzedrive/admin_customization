import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { getAppearanceSettings, updateAppearanceSettings } from '../controllers/appearance-settings.controller';

const router = express.Router();

// GET /api/settings/appearance
// Note: We might want GET to be public if it drives the UI theme for guests too. 
// Assuming public for get, private for update.
router.get('/', getAppearanceSettings);

// PUT /api/settings/appearance
router.put('/', protect, updateAppearanceSettings);

export default router;
