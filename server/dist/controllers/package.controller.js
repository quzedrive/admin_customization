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
exports.getPackageById = exports.getPublicPackages = exports.deletePackage = exports.updatePackage = exports.createPackage = exports.getAdminPackages = void 0;
const status_1 = require("../constants/status");
const package_model_1 = __importDefault(require("../models/package.model"));
// @desc    Get all packages (Admin)
// @route   GET /api/admin/packages
// @access  Private/Admin
const getAdminPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const statusParam = req.query.status;
    const query = { status: { $ne: 0 } }; // Exclude deleted
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    if (statusParam) {
        query.status = parseInt(statusParam);
    }
    const skip = (page - 1) * limit;
    const [packages, total] = yield Promise.all([
        package_model_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        package_model_1.default.countDocuments(query)
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
});
exports.getAdminPackages = getAdminPackages;
// @desc    Create a package
// @route   POST /api/admin/packages
// @access  Private/Admin
const createPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, time, status: pkgStatus, image } = req.body;
    // If a file was uploaded, use its location
    if (req.file) {
        const file = req.file;
        image = file.path || file.secure_url || file.location;
    }
    if (!name || !time) {
        return res.status(400).json({ message: 'Name and time are required' });
    }
    const existingPkg = yield package_model_1.default.findOne({
        name,
        status: { $ne: 0 } // Check only against non-deleted packages
    });
    if (existingPkg) {
        return res.status(400).json({ message: 'Package with this name already exists' });
    }
    try {
        const pkg = yield package_model_1.default.create({
            name,
            time,
            image,
            status: pkgStatus || status_1.status.active,
        });
        res.status(201).json(pkg);
    }
    catch (error) {
        console.error('Create Package Failed:', error.message);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Package with this name already exists' });
        }
        res.status(400).json({ message: 'Invalid package data', error: error.message });
    }
});
exports.createPackage = createPackage;
// @desc    Update a package
// @route   PUT /api/admin/packages/:id
// @access  Private/Admin
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { name, time, status, image } = req.body;
    // If a file was uploaded, use its location
    if (req.file) {
        const file = req.file;
        image = file.path || file.secure_url || file.location;
    }
    const pkg = yield package_model_1.default.findById(id);
    if (pkg) {
        // Check uniqueness if name is being changed
        if (name && name !== pkg.name) {
            const existingPkg = yield package_model_1.default.findOne({
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
        if (status !== undefined)
            pkg.status = status;
        try {
            const updatedPackage = yield pkg.save();
            res.json(updatedPackage);
        }
        catch (error) {
            console.error('Update Package Failed:', error.message);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Package with this name already exists' });
            }
            res.status(400).json({ message: 'Update failed', error: error.message });
        }
    }
    else {
        res.status(404).json({ message: 'Package not found' });
    }
});
exports.updatePackage = updatePackage;
// @desc    Delete a package (Soft delete)
// @route   DELETE /api/admin/packages/:id
// @access  Private/Admin
const deletePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const pkg = yield package_model_1.default.findById(id);
    if (pkg) {
        pkg.status = 0; // Soft delete
        yield pkg.save();
        res.json({ message: 'Package removed' });
    }
    else {
        res.status(404).json({ message: 'Package not found' });
    }
});
exports.deletePackage = deletePackage;
// @desc    Get public active packages
// @route   GET /api/packages
// @access  Public
const getPublicPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const packages = yield package_model_1.default.find({ status: status_1.status.active })
        .select('name time image')
        .sort({ createdAt: -1 });
    res.status(200).json(packages);
});
exports.getPublicPackages = getPublicPackages;
// @desc    Get package by ID (Admin)
// @route   GET /api/packages/admin/:id
// @access  Private/Admin
const getPackageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const pkg = yield package_model_1.default.findById(id);
    if (pkg) {
        res.status(200).json(pkg);
    }
    else {
        res.status(404).json({ message: 'Package not found' });
    }
});
exports.getPackageById = getPackageById;
