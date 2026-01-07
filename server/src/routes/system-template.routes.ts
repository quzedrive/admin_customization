import express from 'express';
import {
    createTemplate,
    deleteTemplate,
    getAllTemplates,
    getTemplateById,
    updateTemplate
} from '../controllers/system-template.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
    .get(protect, getAllTemplates)
    .post(protect, createTemplate);

router.route('/:id')
    .get(protect, getTemplateById)
    .put(protect, updateTemplate)
    .delete(protect, deleteTemplate);

export default router;
