import express from 'express';
import {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    getPublicCars,
    toggleCarStatus,
    getCarBySlug,
    getFeaturedCars,
    toggleFeaturedStatus
} from '../controllers/car.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Public Routes
router.get('/public/featured', getFeaturedCars);
router.get('/public', getPublicCars);
router.get('/public/:slug', getCarBySlug);

// Protected Routes
router.get('/', protect, getAllCars);
router.get('/:id', protect, getCarById);
router.post('/', protect, createCar);
router.put('/:id', protect, updateCar);
router.delete('/:id', protect, deleteCar);
router.patch('/:id/status', protect, toggleCarStatus); // Existing status toggle
router.patch('/:id/featured', protect, toggleFeaturedStatus); // New featured toggle

export default router;
