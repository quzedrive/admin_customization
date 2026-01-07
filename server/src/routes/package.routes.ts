import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import {
    getAdminPackages,
    createPackage,
    updatePackage,
    deletePackage,
    getPublicPackages,
    getPackageById
} from '../controllers/package.controller';

const router = express.Router();

// Public Routes
router.get('/', getPublicPackages);

// Admin Routes
router.get('/admin', protect, getAdminPackages);
router.post('/admin', protect, upload.single('image'), createPackage);
router.get('/admin/:id', protect, getPackageById);
router.put('/admin/:id', protect, upload.single('image'), updatePackage);
router.delete('/admin/:id', protect, deletePackage);


export default router;
