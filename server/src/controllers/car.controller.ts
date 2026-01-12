import { Request, Response } from 'express';
import Car from '../models/cars/car.model';
import CarImage from '../models/cars/car-image.model';
import CarSpecification from '../models/cars/car-specification.model';
import CarPackage from '../models/cars/car-package.model';
import { status } from '../constants/status';

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
        const cars = await Car.find({ status: status.active })
            .populate('images')
            .populate('specifications')
            .populate({
                path: 'packages',
                match: { isActive: true }, // Only get active package mappings
                populate: { path: 'package' } // Populate the actual Package details
            })
            .sort({ createdAt: -1 });
        res.status(200).json(cars);
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
            slug: manualSlug // Optional if manually passed, but we generate from name typically
        } = req.body;

        // Logic for slug update:
        // 1. If manualSlug is provided and different from current, use it (and check unique).
        // 2. If name changes and NO manualSlug provided, generate from name.

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
            // Strategy: 
            // 1. If it's a new mapping (no _id), create it.
            // 2. If it's an existing mapping (has _id), update it.
            // 3. (Optional) If mappings are missing from this list but exist in DB, delete them? 
            //    For now, let's assume we replace the list of references in the Car, but we might leave orphaned docs if we aren't careful.
            //    Better: Delete all old mappings for this car and recreate/re-link? Or update in place.
            //    Let's go with: Update existing if ID match, Create new otherwise. Rebuild the `car.packages` array.

            const finalPackageIds = [];

            for (const pkg of packages) {
                if (pkg._id) {
                    // Existing CarPackage doc, update it
                    await CarPackage.findByIdAndUpdate(pkg._id, {
                        package: pkg.package,
                        price: pkg.price,
                        discountPrice: pkg.discountPrice,
                        halfDayPrice: pkg.halfDayPrice,
                        isActive: pkg.isActive
                    });
                    finalPackageIds.push(pkg._id);
                } else {
                    // New mapping
                    const newCarPkg = await CarPackage.create({
                        car: car._id,
                        package: pkg.package,
                        price: pkg.price,
                        discountPrice: pkg.discountPrice,
                        halfDayPrice: pkg.halfDayPrice,
                        isActive: pkg.isActive
                    });
                    finalPackageIds.push(newCarPkg._id);
                }
            }
            car.packages = finalPackageIds as any; // Cast mainly for TS if it complains about ObjectId vs String
        }

        // Update Images (If provided, we replace. For more granular control, we'd need add/remove logic)
        if (images && Array.isArray(images)) {
            // For simplicity, we are assuming the frontend sends the "final" state of images.
            // If they are new URLs (strings), we create records. If they are existing IDs, we keep them? 
            // Or maybe we treat them all as new for this specific "separate model" requirement if they are ephemeral?
            // Better approach: If it looks like an ID, keep it. If it looks like a URL, create new.
            const newImageIds = [];
            for (const img of images) {
                if (typeof img === 'string' && img.startsWith('http')) {
                    const newImage = await CarImage.create({ url: img });
                    newImageIds.push(newImage._id);
                } else if (img._id || (typeof img === 'string' && !img.startsWith('http'))) {
                    // Assume it's an ID or object with _id
                    newImageIds.push(img._id || img);
                }
            }
            car.images = newImageIds;
        }

        // Update Specifications
        if (specifications && Array.isArray(specifications)) {
            const newSpecIds = [];
            for (const spec of specifications) {
                // If it has an ID, keep it (or update it? Let's assume replace for simplicity or create new if no ID)
                if (spec._id) {
                    // Optional update logic could go here
                    newSpecIds.push(spec._id);
                } else {
                    const newSpec = await CarSpecification.create({
                        icon: spec.icon,
                        text: spec.text
                    });
                    newSpecIds.push(newSpec._id);
                }
            }
            car.specifications = newSpecIds;
        }

        const updatedCar = await car.save();
        res.status(200).json(updatedCar);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
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
