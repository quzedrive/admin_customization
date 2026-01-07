import express from 'express';
import {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    getPublicCars,
    toggleCarStatus
} from '../controllers/car.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/public', getPublicCars);

router.route('/')
    .get(protect, getAllCars)
    .post(protect, createCar);

router.route('/:id')
    .get(protect, getCarById)
    .put(protect, updateCar)
    .delete(protect, deleteCar);

router.route('/:id/status').patch(protect, toggleCarStatus);

export default router;
