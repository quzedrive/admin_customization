import { Request, Response } from 'express';
import { status } from '../constants/status';
import Brand from '../models/brand.model';

// @desc    Get all brands (Admin)
// @route   GET /api/admin/brands
// @access  Private/Admin
export const getAdminBrands = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const statusParam = req.query.status as string;

    const query: any = { status: { $ne: 0 } }; // Exclude deleted (0) by default

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    if (statusParam) {
        query.status = parseInt(statusParam);
    }

    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
        Brand.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Brand.countDocuments(query)
    ]);

    res.status(200).json({
        brands,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
};

// @desc    Create a brand
// @route   POST /api/admin/brands
// @access  Private/Admin
export const createBrand = async (req: Request, res: Response) => {
    let { name, slug, logo, status: brandStatus } = req.body;

    // If a file was uploaded, use its location (S3 URL) as the logo
    if (req.file) {
        const file = req.file as any;
        logo = file.path || file.secure_url || file.location;
    }

    console.log('Create Brand Request:', { ...req.body, logo: logo });

    const brandExists = await Brand.findOne({ slug, status: { $ne: 0 } });
    if (brandExists) {
        console.error('Create Brand Failed: Slug exists', slug);
        return res.status(400).json({ message: 'Brand slug already exists' });
    }

    try {
        const brand = await Brand.create({
            name,
            slug,
            logo,
            status: brandStatus || status.active,
        });

        if (brand) {
            res.status(201).json(brand);
        } else {
            console.error('Create Brand Failed: Unknown error');
            res.status(400).json({ message: 'Invalid brand data' });
        }
    } catch (error: any) {
        // Check for duplicate key error (MongoDB code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Brand slug already exists' });
        }
        console.error('Create Brand Failed: Database/Validation Error', error.message);
        res.status(400).json({ message: 'Invalid brand data', error: error.message });
    }
};

// @desc    Get public active brands
// @route   GET /api/brands
// @access  Public
export const getPublicBrands = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    const query: any = { status: status.active };

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
        Brand.find(query)
            .select('name slug logo')
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit),
        Brand.countDocuments(query)
    ]);

    res.status(200).json({
        brands,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
};

// @desc    Update a brand
// @route   PUT /api/admin/brands/:id
// @access  Private/Admin
export const updateBrand = async (req: Request, res: Response) => {
    const { id } = req.params;
    let { name, slug, logo, status } = req.body;

    // If a file was uploaded, use its location as the new logo
    if (req.file) {
        const file = req.file as any;
        logo = file.path || file.secure_url || file.location;
    }

    const brand = await Brand.findById(id);

    if (brand) {
        // Check if slug is being updated and if it conflicts with another active/inactive brand
        if (slug && slug !== brand.slug) {
            const existingBrand = await Brand.findOne({ slug, status: { $ne: 0 } });
            if (existingBrand) {
                return res.status(400).json({ message: 'Brand slug already exists' });
            }
        }

        brand.name = name || brand.name;
        brand.slug = slug || brand.slug;
        brand.logo = logo || brand.logo;
        if (status !== undefined) brand.status = status;

        try {
            const updatedBrand = await brand.save();
            res.json(updatedBrand);
        } catch (error: any) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Brand slug already exists' });
            }
            res.status(400).json({ message: 'Invalid brand data', error: error.message });
        }
    } else {
        res.status(404).json({ message: 'Brand not found' });
    }
};

// @desc    Delete a brand (Soft delete)
// @route   DELETE /api/admin/brands/:id
// @access  Private/Admin
export const deleteBrand = async (req: Request, res: Response) => {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (brand) {
        brand.status = 0; // Soft delete
        await brand.save();
        res.json({ message: 'Brand removed' });
    } else {
        res.status(404).json({ message: 'Brand not found' });
    }
};
