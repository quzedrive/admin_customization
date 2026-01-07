import express from 'express';
import {
    createReason,
    getAllReasons,
    getReasonById,
    updateReason,
    deleteReason
} from '../controllers/cancellation-reason.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
    .post(protect, createReason)
    .get(protect, getAllReasons);

router.route('/:id')
    .get(protect, getReasonById)
    .put(protect, updateReason)
    .delete(protect, deleteReason);

export default router;
