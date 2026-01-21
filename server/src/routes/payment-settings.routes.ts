import express from 'express';
import { getPaymentSettings, updatePaymentSettings, getActivePaymentMethod, updateActiveMethod } from '../controllers/payment-settings.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, admin, getPaymentSettings)
    .put(protect, admin, updatePaymentSettings);

router.route('/active-method')
    .get(getActivePaymentMethod)
    .patch(protect, admin, updateActiveMethod);

export default router;
