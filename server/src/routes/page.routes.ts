import express from 'express';
import { createPage, getAllPages, getPageBySlug, getPageBySlugAdmin, updatePage, deletePage } from '../controllers/page.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', protect, admin, createPage);
router.get('/', protect, admin, getAllPages);
router.get('/admin/:slug', protect, admin, getPageBySlugAdmin); // Admin fetch by slug (all statuses)
router.get('/:slug', getPageBySlug); // Public fetch (active only)
router.put('/:id', protect, admin, updatePage);
router.delete('/:id', protect, admin, deletePage);

export default router;
