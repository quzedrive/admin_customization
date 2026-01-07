"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCarStatus = exports.deleteCar = exports.updateCar = exports.createCar = exports.getCarById = exports.getPublicCars = exports.getAllCars = void 0;
const car_model_1 = __importDefault(require("../models/cars/car.model"));
const car_image_model_1 = __importDefault(require("../models/cars/car-image.model"));
const car_specification_model_1 = __importDefault(require("../models/cars/car-specification.model"));
const car_package_model_1 = __importDefault(require("../models/cars/car-package.model"));
const status_1 = require("../constants/status");
// @desc    Get all cars
// @route   GET /api/cars
// @access  Private
const getAllCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cars = yield car_model_1.default.find({ status: { $ne: status_1.status.deleted } })
            .populate('images')
            .populate('specifications')
            .populate({
            path: 'packages',
            populate: { path: 'package' } // Populate the Package inside CarPackage
        })
            .sort({ createdAt: -1 });
        res.status(200).json(cars);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllCars = getAllCars;
// @desc    Get public cars
// @route   GET /api/cars/public
// @access  Public
const getPublicCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cars = yield car_model_1.default.find({ status: status_1.status.active })
            .populate('images')
            .populate('specifications')
            .populate({
            path: 'packages',
            match: { isActive: true }, // Only get active package mappings
            populate: { path: 'package' } // Populate the actual Package details
        })
            .sort({ createdAt: -1 });
        res.status(200).json(cars);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getPublicCars = getPublicCars;
// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Private
const getCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield car_model_1.default.findById(req.params.id)
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCarById = getCarById;
// @desc    Create car
// @route   POST /api/cars
// @access  Private
const createCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brand, name, type, transmission, fuelType, seatingCapacity, basePrice, hourlyCharge, additionalHourlyCharge, images, // Array of strings (URLs) or objects if needed
        packages, // Array of { packageId, price, isActive }
        description, specifications, // Array of { icon, text }
        activeStatus } = req.body;
        // 1. Handle Images
        const imageIds = [];
        if (images && Array.isArray(images)) {
            for (const img of images) {
                // If img is just a URL string
                const url = typeof img === 'string' ? img : img.url;
                const newImage = yield car_image_model_1.default.create({ url });
                imageIds.push(newImage._id);
            }
        }
        // 2. Handle Specifications
        const specIds = [];
        if (specifications && Array.isArray(specifications)) {
            for (const spec of specifications) {
                const newSpec = yield car_specification_model_1.default.create({
                    icon: spec.icon,
                    text: spec.text
                });
                specIds.push(newSpec._id);
            }
        }
        // 3. Create Car (Initially without packages)
        const car = yield car_model_1.default.create({
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
            status: activeStatus !== undefined ? activeStatus : status_1.status.active
        });
        // 4. Handle Packages (CarPackage Mapping)
        const carPackageIds = [];
        if (packages && Array.isArray(packages)) {
            for (const pkg of packages) {
                // pkg = { packageId, price, isActive }
                const newCarPackage = yield car_package_model_1.default.create({
                    car: car._id,
                    package: pkg.package, // Assuming the input sends 'package' as ID
                    price: pkg.price,
                    isActive: pkg.isActive,
                    isAvailable: pkg.isAvailable
                });
                carPackageIds.push(newCarPackage._id);
            }
        }
        // Update car with package references
        if (carPackageIds.length > 0) {
            car.packages = carPackageIds;
            yield car.save();
        }
        res.status(201).json(car);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createCar = createCar;
// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private
// NOTE: Updating specs and images can be complex. For simplicity, we might replace them or handle them smartly.
// Here we will replicate the create logic for replacements for simplicity, or expect exact IDs if preserving.
// A common pattern is to delete old refs and create new ones if the array is fully replaced.
const updateCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield car_model_1.default.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        const { brand, name, type, transmission, fuelType, seatingCapacity, basePrice, hourlyCharge, additionalHourlyCharge, images, packages, description, specifications, status: carStatus } = req.body;
        // Update basic fields
        car.brand = brand || car.brand;
        car.name = name || car.name;
        car.type = type || car.type;
        car.transmission = transmission || car.transmission;
        car.fuelType = fuelType || car.fuelType;
        car.seatingCapacity = seatingCapacity !== null && seatingCapacity !== void 0 ? seatingCapacity : car.seatingCapacity;
        car.basePrice = basePrice !== null && basePrice !== void 0 ? basePrice : car.basePrice;
        car.hourlyCharge = hourlyCharge !== null && hourlyCharge !== void 0 ? hourlyCharge : car.hourlyCharge;
        car.additionalHourlyCharge = additionalHourlyCharge !== null && additionalHourlyCharge !== void 0 ? additionalHourlyCharge : car.additionalHourlyCharge;
        car.description = description || car.description;
        if (carStatus !== undefined)
            car.status = carStatus;
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
                    yield car_package_model_1.default.findByIdAndUpdate(pkg._id, {
                        package: pkg.package,
                        price: pkg.price,
                        isActive: pkg.isActive,
                        isAvailable: pkg.isAvailable
                    });
                    finalPackageIds.push(pkg._id);
                }
                else {
                    // New mapping
                    const newCarPkg = yield car_package_model_1.default.create({
                        car: car._id,
                        package: pkg.package,
                        price: pkg.price,
                        isActive: pkg.isActive,
                        isAvailable: pkg.isAvailable
                    });
                    finalPackageIds.push(newCarPkg._id);
                }
            }
            car.packages = finalPackageIds; // Cast mainly for TS if it complains about ObjectId vs String
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
                    const newImage = yield car_image_model_1.default.create({ url: img });
                    newImageIds.push(newImage._id);
                }
                else if (img._id || (typeof img === 'string' && !img.startsWith('http'))) {
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
                }
                else {
                    const newSpec = yield car_specification_model_1.default.create({
                        icon: spec.icon,
                        text: spec.text
                    });
                    newSpecIds.push(newSpec._id);
                }
            }
            car.specifications = newSpecIds;
        }
        const updatedCar = yield car.save();
        res.status(200).json(updatedCar);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateCar = updateCar;
// @desc    Delete car (Soft delete)
// @route   DELETE /api/cars/:id
// @access  Private
const deleteCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield car_model_1.default.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        car.status = status_1.status.deleted;
        yield car.save();
        res.status(200).json({ message: 'Car removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteCar = deleteCar;
// @desc    Toggle car status
// @route   PATCH /api/cars/:id/status
// @access  Private
const toggleCarStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const car = yield car_model_1.default.findById(req.params.id);
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
        }
        else {
            // Default toggle behavior if no status sent
            // If active(1) -> inactive(2). If inactive(2) -> active(1).
            // status.deleted(0) remains unchanged unless explicitly set (but we filtered that out in Find usually)
            if (car.status === status_1.status.active) {
                car.status = status_1.status.inactive;
            }
            else if (car.status === status_1.status.inactive) {
                car.status = status_1.status.active;
            }
            // If status is deleted(0) or something else, do nothing or handle accordingly. 
            // Here we assume we only toggle between active/inactive.
        }
        yield car.save();
        res.status(200).json({ message: 'Car status updated', status: car.status });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.toggleCarStatus = toggleCarStatus;
