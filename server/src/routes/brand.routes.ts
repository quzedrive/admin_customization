import express from 'express';
import { getPublicBrands, getAdminBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brand.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

// Public: Get active brands
router.get('/', getPublicBrands);

// Admin: Get all brands (with pagination/search/status)
router.get('/admin', protect, getAdminBrands);

// Admin: Create new brand
router.post('/admin', protect, upload.single('logo'), createBrand);

// Admin: Update brand
router.put('/admin/:id', protect, upload.single('logo'), updateBrand);

// Admin: Delete brand (Soft delete)
router.delete('/admin/:id', protect, deleteBrand);

export default router;
