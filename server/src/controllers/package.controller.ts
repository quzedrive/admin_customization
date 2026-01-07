import { Request, Response } from 'express';
import { status } from '../constants/status';
import Package from '../models/package.model';

// @desc    Get all packages (Admin)
// @route   GET /api/admin/packages
// @access  Private/Admin
export const getAdminPackages = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const statusParam = req.query.status as string;

    const query: any = { status: { $ne: 0 } }; // Exclude deleted

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    if (statusParam) {
        query.status = parseInt(statusParam);
    }

    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
        Package.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Package.countDocuments(query)
    ]);

    res.status(200).json({
        packages,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
};

// @desc    Create a package
// @route   POST /api/admin/packages
// @access  Private/Admin
export const createPackage = async (req: Request, res: Response) => {
    let { name, time, status: pkgStatus, image } = req.body;

    // If a file was uploaded, use its location
    if (req.file) {
        const file = req.file as any;
        image = file.path || file.secure_url || file.location;
    }

    if (!name || !time) {
        return res.status(400).json({ message: 'Name and time are required' });
    }

    const existingPkg = await Package.findOne({
        name,
        status: { $ne: 0 } // Check only against non-deleted packages
    });

    if (existingPkg) {
        return res.status(400).json({ message: 'Package with this name already exists' });
    }

    try {
        const pkg = await Package.create({
            name,
            time,
            image,
            status: pkgStatus || status.active,
        });

        res.status(201).json(pkg);
    } catch (error: any) {
        console.error('Create Package Failed:', error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Package with this name already exists' });
        }
        res.status(400).json({ message: 'Invalid package data', error: error.message });
    }
};

// @desc    Update a package
// @route   PUT /api/admin/packages/:id
// @access  Private/Admin
export const updatePackage = async (req: Request, res: Response) => {
    const { id } = req.params;
    let { name, time, status, image } = req.body;

    // If a file was uploaded, use its location
    if (req.file) {
        const file = req.file as any;
        image = file.path || file.secure_url || file.location;
    }

    const pkg = await Package.findById(id);

    if (pkg) {
        // Check uniqueness if name is being changed
        if (name && name !== pkg.name) {
            const existingPkg = await Package.findOne({
                name,
                status: { $ne: 0 }
            });

            if (existingPkg) {
                return res.status(400).json({ message: 'Package with this name already exists' });
            }
        }

        pkg.name = name || pkg.name;
        pkg.time = time || pkg.time;
        pkg.image = image || pkg.image;
        if (status !== undefined) pkg.status = status;

        try {
            const updatedPackage = await pkg.save();
            res.json(updatedPackage);
        } catch (error: any) {
            console.error('Update Package Failed:', error.message);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Package with this name already exists' });
            }
            res.status(400).json({ message: 'Update failed', error: error.message });
        }
    } else {
        res.status(404).json({ message: 'Package not found' });
    }
};

// @desc    Delete a package (Soft delete)
// @route   DELETE /api/admin/packages/:id
// @access  Private/Admin
export const deletePackage = async (req: Request, res: Response) => {
    const { id } = req.params;

    const pkg = await Package.findById(id);

    if (pkg) {
        pkg.status = 0; // Soft delete
        await pkg.save();
        res.json({ message: 'Package removed' });
    } else {
        res.status(404).json({ message: 'Package not found' });
    }
};

// @desc    Get public active packages
// @route   GET /api/packages
// @access  Public
export const getPublicPackages = async (req: Request, res: Response) => {
    const packages = await Package.find({ status: status.active })
        .select('name time image')
        .sort({ createdAt: -1 });

    res.status(200).json(packages);
};

// @desc    Get package by ID (Admin)
// @route   GET /api/packages/admin/:id
// @access  Private/Admin
export const getPackageById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const pkg = await Package.findById(id);

    if (pkg) {
        res.status(200).json(pkg);
    } else {
        res.status(404).json({ message: 'Package not found' });
    }
};
