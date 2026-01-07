import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { getEmailConfig, updateEmailConfig } from '../controllers/email-config.controller';

const router = express.Router();

// GET /api/settings/email
router.get('/', protect, getEmailConfig);

// PUT /api/settings/email
router.put('/', protect, updateEmailConfig);

export default router;
