import { Request, Response } from 'express';
import Car from '../models/cars/car.model';
import CarImage from '../models/cars/car-image.model';
import CarSpecification from '../models/cars/car-specification.model';
import CarPackage from '../models/cars/car-package.model';
import { status, featuredStatus } from '../constants/status';

const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

// @desc    Get all cars
// @route   GET /api/cars
// @access  Private
export const getAllCars = async (req: Request, res: Response) => {
    try {
        const cars = await Car.find({ status: { $ne: status.deleted } })
            .populate('images')
            .populate('specifications')
            .populate({
                path: 'packages',
                populate: { path: 'package' } // Populate the Package inside CarPackage
            })
            .sort({ createdAt: -1 });
        res.status(200).json(cars);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get public cars
// @route   GET /api/cars/public
// @access  Public
export const getPublicCars = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const total = await Car.countDocuments({ status: status.active });

        const cars = await Car.find({ status: status.active })
            .populate('images')
            .populate('specifications')
            .populate({
                path: 'packages',
                match: { isActive: true }, // Only get active package mappings
                populate: { path: 'package' } // Populate the actual Package details
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            cars,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single car by slug (Public)
// @route   GET /api/cars/public/:slug
// @access  Public
export const getCarBySlug = async (req: Request, res: Response) => {
    try {
        const car = await Car.findOne({ slug: req.params.slug, status: status.active })
            .populate('images')
            .populate('specifications')
            .populate({
                path: 'packages',
                match: { isActive: true },
                populate: { path: 'package' }
            });

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Private
export const getCarById = async (req: Request, res: Response) => {
    try {
        const car = await Car.findById(req.params.id)
            .populate('images')
            .populate('specifications')
            .populate({
                path: 'packages',
                populate: { path: 'package' }
            });

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create car
// @route   POST /api/cars
// @access  Private
export const createCar = async (req: Request, res: Response) => {
    try {
        const {
            brand,
            name,
            type,
            transmission,
            fuelType,
            seatingCapacity,
            basePrice,
            hourlyCharge,
            additionalHourlyCharge,
            images, // Array of strings (URLs) or objects if needed
            packages, // Array of { packageId, price, isActive }
            description,
            specifications, // Array of { icon, text }
            host, // { type, details }
            status: activeStatus,
            slug: manualSlug
        } = req.body;

        const slug = manualSlug || generateSlug(name);

        // Check for existing slug (excluding deleted cars)
        const existingCar = await Car.findOne({ slug, status: { $ne: status.deleted } });
        if (existingCar) {
            return res.status(409).json({ message: 'Car with this name already exists' });
        }

        // 1. Handle Images
        const imageIds = [];
        if (images && Array.isArray(images)) {
            for (const img of images) {
                // If img is just a URL string
                const url = typeof img === 'string' ? img : img.url;
                const newImage = await CarImage.create({ url });
                imageIds.push(newImage._id);
            }
        }

        // 2. Handle Specifications
        const specIds = [];
        if (specifications && Array.isArray(specifications)) {
            for (const spec of specifications) {
                const newSpec = await CarSpecification.create({
                    icon: spec.icon,
                    text: spec.text
                });
                specIds.push(newSpec._id);
            }
        }

        // 3. Create Car (Initially without packages)
        const car = await Car.create({
            brand,
            name,
            type,
            transmission,
            fuelType,
            seatingCapacity,
            basePrice,
            hourlyCharge,
            additionalHourlyCharge,
            images: imageIds,
            packages: [],
            description,
            specifications: specIds,
            host, // Pass host object directly, validation handled by Schema
            status: activeStatus !== undefined ? activeStatus : status.active,
            slug: slug
        });

        // 4. Handle Packages (CarPackage Mapping)
        const carPackageIds = [];
        if (packages && Array.isArray(packages)) {
            for (const pkg of packages) {
                // pkg = { packageId, price, isActive }
                const newCarPackage = await CarPackage.create({
                    car: car._id,
                    package: pkg.package, // Assuming the input sends 'package' as ID
                    price: pkg.price,
                    discountPrice: pkg.discountPrice,
                    halfDayPrice: pkg.halfDayPrice,
                    isActive: pkg.isActive
                });
                carPackageIds.push(newCarPackage._id);
            }
        }

        // Update car with package references
        if (carPackageIds.length > 0) {
            car.packages = carPackageIds as any;
            await car.save();
        }

        res.status(201).json(car);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private
// NOTE: Updating specs and images can be complex. For simplicity, we might replace them or handle them smartly.
// Here we will replicate the create logic for replacements for simplicity, or expect exact IDs if preserving.
// A common pattern is to delete old refs and create new ones if the array is fully replaced.
export const updateCar = async (req: Request, res: Response) => {
    try {
        console.log(`[Update Car] Request ID: ${req.params.id}`);
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        const {
            brand,
            name,
            type,
            transmission,
            fuelType,
            seatingCapacity,
            basePrice,
            hourlyCharge,
            additionalHourlyCharge,
            images,
            packages,
            description,
            specifications,
            host,
            status: carStatus,
            slug: manualSlug
        } = req.body;

        let newSlug = car.slug;
        let shouldCheckUnique = false;

        if (manualSlug && manualSlug !== car.slug) {
            newSlug = manualSlug;
            shouldCheckUnique = true;
        } else if (name && name !== car.name && !manualSlug) {
            newSlug = generateSlug(name);
            shouldCheckUnique = true;
        }

        if (shouldCheckUnique) {
            const existingCar = await Car.findOne({ slug: newSlug, status: { $ne: status.deleted }, _id: { $ne: car._id } });
            if (existingCar) {
                return res.status(409).json({ message: 'Car with this name/slug already exists' });
            }
            car.slug = newSlug;
        }

        // Update basic fields
        car.brand = brand || car.brand;
        car.name = name || car.name;
        car.type = type || car.type;
        car.transmission = transmission || car.transmission;
        car.fuelType = fuelType || car.fuelType;
        car.seatingCapacity = seatingCapacity ?? car.seatingCapacity;
        car.basePrice = basePrice ?? car.basePrice;
        car.hourlyCharge = hourlyCharge ?? car.hourlyCharge;
        car.additionalHourlyCharge = additionalHourlyCharge ?? car.additionalHourlyCharge;
        car.description = description || car.description;
        if (host) car.host = host; // Update host if provided
        if (carStatus !== undefined) car.status = carStatus;

        // Update Packages
        if (packages && Array.isArray(packages)) {
            try {
                const finalPackageIds = [];
                for (const pkg of packages) {
                    if (pkg._id && !pkg._id.toString().startsWith('new_')) { // Ensure valid ID format if needed, simplistic check
                        // Existing CarPackage doc, update it
                        // Safe Cast for pkg.package if it comes as object
                        const packageId = (pkg.package as any)?._id || pkg.package;

                        await CarPackage.findByIdAndUpdate(pkg._id, {
                            package: packageId,
                            price: pkg.price,
                            discountPrice: pkg.discountPrice,
                            halfDayPrice: pkg.halfDayPrice,
                            isActive: pkg.isActive
                        });
                        finalPackageIds.push(pkg._id);
                    } else {
                        // New mapping
                        const packageId = (pkg.package as any)?._id || pkg.package;

                        const newCarPkg = await CarPackage.create({
                            car: car._id,
                            package: packageId,
                            price: pkg.price,
                            discountPrice: pkg.discountPrice,
                            halfDayPrice: pkg.halfDayPrice,
                            isActive: pkg.isActive
                        });
                        finalPackageIds.push(newCarPkg._id);
                    }
                }
                car.packages = finalPackageIds as any;
            } catch (pkgError) {
                console.error('[Update Car] Package Error:', pkgError);
                throw new Error(`Package Update Failed: ${(pkgError as any).message}`);
            }
        }

        // Update Images
        if (images && Array.isArray(images)) {
            try {
                const newImageIds = [];
                for (const img of images) {
                    if (typeof img === 'string') {
                        // Check if it is a valid ObjectId (24 hex characters)
                        if (img.match(/^[0-9a-fA-F]{24}$/)) {
                            newImageIds.push(img);
                        } else {
                            // Treat as URL or Data URI (base64) -> Create new CarImage
                            // This handles http, https, relative paths, and data: URIs
                            const newImage = await CarImage.create({ url: img });
                            newImageIds.push(newImage._id);
                        }
                    } else if (img && img._id) {
                        // It's an Object with _id
                        newImageIds.push(img._id);
                    }
                }
                car.images = newImageIds;
            } catch (imgError) {
                console.error('[Update Car] Image Error:', imgError);
                throw new Error(`Image Update Failed: ${(imgError as any).message}`);
            }
        }

        // Update Specifications
        if (specifications && Array.isArray(specifications)) {
            try {
                const newSpecIds = [];
                for (const spec of specifications) {
                    // Filter out empty specs
                    if (!spec.icon && !spec.text) continue;

                    if (spec._id) {
                        newSpecIds.push(spec._id);
                    } else {
                        // Validate required fields before create
                        if (!spec.icon || !spec.text) {
                            // Skip or fill defaults? Model requires them.
                            // If partial data, maybe skip or use 'N/A'?
                            // Let's Skip to prevent crash.
                            // console.warn('Skipping invalid spec:', spec);
                            continue;
                        }
                        const newSpec = await CarSpecification.create({
                            icon: spec.icon,
                            text: spec.text
                        });
                        newSpecIds.push(newSpec._id);
                    }
                }
                car.specifications = newSpecIds;
            } catch (specError) {
                console.error('[Update Car] Spec Error:', specError);
                throw new Error(`Spec Update Failed: ${(specError as any).message}`);
            }
        }

        const updatedCar = await car.save();
        console.log(`[Update Car] Success: ${updatedCar._id}`);
        res.status(200).json(updatedCar);
    } catch (error: any) {
        console.error('[Update Car] Fatal Error:', error);
        res.status(500).json({ message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined });
    }
};

// @desc    Delete car (Soft delete)
// @route   DELETE /api/cars/:id
// @access  Private
export const deleteCar = async (req: Request, res: Response) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        car.status = status.deleted;
        await car.save();
        res.status(200).json({ message: 'Car removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Toggle car status
// @route   PATCH /api/cars/:id/status
// @access  Private
export const toggleCarStatus = async (req: Request, res: Response) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Toggle between 1 (active) and 0 (inactive/draft)
        // Assuming status.active = 1, status.inactive = 0 (or similar logic)
        // If current status is Active, make it Inactive. Otherwise make it Active.
        // But we should probably rely on the request body or just toggle blindly?
        // Let's rely on the body for precision, or just toggle.
        // User asked for "toggle", generally implies a blind switch or a specific set.
        // Let's accept a status value for clarity, or just toggle if boolean logic applies.
        // Given 'status' constant usage, explicit is better.
        // Actually, the UI usually sends the *new* intended status.

        const { status: newStatus } = req.body;

        // If newStatus provided, use it. Else toggle.
        if (newStatus !== undefined) {
            car.status = newStatus;
        } else {
            // Default toggle behavior if no status sent
            // If active(1) -> inactive(2). If inactive(2) -> active(1).
            // status.deleted(0) remains unchanged unless explicitly set (but we filtered that out in Find usually)

            if (car.status === status.active) {
                car.status = status.inactive;
            } else if (car.status === status.inactive) {
                car.status = status.active;
            }
            // If status is deleted(0) or something else, do nothing or handle accordingly. 
            // Here we assume we only toggle between active/inactive.
        }

        await car.save();
        res.status(200).json({ message: 'Car status updated', status: car.status });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Toggle car featured status
// @route   PATCH /api/cars/:id/featured
// @access  Private
export const toggleFeaturedStatus = async (req: Request, res: Response) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Determine new status: defaults to toggle if not provided
        let newStatus = req.body.status;

        if (newStatus === undefined) {
            // Toggle logic
            if (car.featured === featuredStatus.active) {
                newStatus = featuredStatus.inactive;
            } else {
                newStatus = featuredStatus.active;
            }
        }

        // Logic check: If setting to Active
        if (newStatus === featuredStatus.active) {
            // Check how many are already active
            const activeFeaturedCount = await Car.countDocuments({
                featured: featuredStatus.active,
                status: { $ne: status.deleted } // validation only against non-deleted cars
            });

            // If we are activating this car, and it wasn't already active
            if (car.featured !== featuredStatus.active && activeFeaturedCount >= 3) {
                return res.status(400).json({ message: 'Maximum 3 cars can be featured at a time.' });
            }
        }

        car.featured = newStatus;
        await car.save();

        res.status(200).json({ message: 'Car featured status updated', featured: car.featured });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get featured cars (Public)
// @route   GET /api/cars/featured
// @access  Public
export const getFeaturedCars = async (req: Request, res: Response) => {
    try {
        const cars = await Car.find({
            featured: featuredStatus.active,
            status: status.active // Ensure car itself is active
        })
            .populate('images')
            .populate('specifications')
            .populate({
                path: 'packages',
                match: { isActive: true },
                populate: { path: 'package' }
            })
            .limit(3); // Double safety

        res.status(200).json(cars);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
