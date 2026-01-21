import { Request, Response } from 'express';
import Page from '../models/content/page.model';

// Create a new page
export const createPage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, slug, content, status } = req.body;

        // Check if slug exists
        const existingPage = await Page.findOne({ slug, status: { $ne: 0 } });
        if (existingPage) {
            res.status(400).json({ message: 'Page with this slug already exists' });
            return;
        }

        const newPage = new Page({ title, slug, content, status: status ?? 1 });
        await newPage.save();
        res.status(201).json(newPage);
    } catch (error) {
        res.status(500).json({ message: 'Error creating page', error });
    }
};

// Get all pages (Admin - Paginated, Filtered, Sorted)
export const getAllPages = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search as string;
        const status = req.query.status as string;

        // Base query: exclude deleted (0)
        let query: any = { status: { $ne: 0 } };

        // Apply Status Filter
        if (status && status !== '') {
            query.status = parseInt(status);
        }

        // Apply Search Filter (Title or Slug)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const totalDocs = await Page.countDocuments(query);
        const totalPages = Math.ceil(totalDocs / limit);

        // Fetch data
        const pages = await Page.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            docs: pages,
            totalDocs,
            limit,
            totalPages,
            page,
            pagingCounter: skip + 1,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pages', error });
    }
};

// Get page by slug (Public - only active)
export const getPageBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const page = await Page.findOne({ slug, status: 1 });

        if (!page) {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        res.status(200).json(page);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching page', error });
    }
};

// Get page by slug (Admin - All statuses) - Intended for /admin/slug endpoint
export const getPageBySlugAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const page = await Page.findOne({ slug });

        if (!page) {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        res.status(200).json(page);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching page', error });
    }
};

// Update page
export const updatePage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, slug, content, status } = req.body;

        // Check if slug exists in other active/inactive pages
        if (slug) {
            const existingPage = await Page.findOne({
                slug,
                status: { $ne: 0 },
                _id: { $ne: id } // Exclude current page
            });

            if (existingPage) {
                res.status(400).json({ message: 'Page with this slug already exists' });
                return;
            }
        }

        const updatedPage = await Page.findByIdAndUpdate(
            id,
            { title, slug, content, status },
            { new: true }
        );

        if (!updatedPage) {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        res.status(200).json(updatedPage);
    } catch (error) {
        res.status(500).json({ message: 'Error updating page', error });
    }
};

// Soft delete page
export const deletePage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedPage = await Page.findByIdAndUpdate(id, { status: 0 }, { new: true });

        if (!deletedPage) {
            res.status(404).json({ message: 'Page not found' });
            return;
        }
        res.status(200).json({ message: 'Page deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting page', error });
    }
};
