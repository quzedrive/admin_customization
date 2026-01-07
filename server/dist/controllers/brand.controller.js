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
exports.deleteBrand = exports.updateBrand = exports.getPublicBrands = exports.createBrand = exports.getAdminBrands = void 0;
const status_1 = require("../constants/status");
const brand_model_1 = __importDefault(require("../models/brand.model"));
// @desc    Get all brands (Admin)
// @route   GET /api/admin/brands
// @access  Private/Admin
const getAdminBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const statusParam = req.query.status;
    const query = { status: { $ne: 0 } }; // Exclude deleted (0) by default
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    if (statusParam) {
        query.status = parseInt(statusParam);
    }
    const skip = (page - 1) * limit;
    const [brands, total] = yield Promise.all([
        brand_model_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        brand_model_1.default.countDocuments(query)
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
});
exports.getAdminBrands = getAdminBrands;
// @desc    Create a brand
// @route   POST /api/admin/brands
// @access  Private/Admin
const createBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, slug, logo, status: brandStatus } = req.body;
    // If a file was uploaded, use its location (S3 URL) as the logo
    if (req.file) {
        const file = req.file;
        logo = file.path || file.secure_url || file.location;
    }
    console.log('Create Brand Request:', Object.assign(Object.assign({}, req.body), { logo: logo }));
    const brandExists = yield brand_model_1.default.findOne({ slug, status: { $ne: 0 } });
    if (brandExists) {
        console.error('Create Brand Failed: Slug exists', slug);
        return res.status(400).json({ message: 'Brand slug already exists' });
    }
    try {
        const brand = yield brand_model_1.default.create({
            name,
            slug,
            logo,
            status: brandStatus || status_1.status.active,
        });
        if (brand) {
            res.status(201).json(brand);
        }
        else {
            console.error('Create Brand Failed: Unknown error');
            res.status(400).json({ message: 'Invalid brand data' });
        }
    }
    catch (error) {
        // Check for duplicate key error (MongoDB code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Brand slug already exists' });
        }
        console.error('Create Brand Failed: Database/Validation Error', error.message);
        res.status(400).json({ message: 'Invalid brand data', error: error.message });
    }
});
exports.createBrand = createBrand;
// @desc    Get public active brands
// @route   GET /api/brands
// @access  Public
const getPublicBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const query = { status: status_1.status.active };
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    const skip = (page - 1) * limit;
    const [brands, total] = yield Promise.all([
        brand_model_1.default.find(query)
            .select('name slug logo')
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit),
        brand_model_1.default.countDocuments(query)
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
});
exports.getPublicBrands = getPublicBrands;
// @desc    Update a brand
// @route   PUT /api/admin/brands/:id
// @access  Private/Admin
const updateBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { name, slug, logo, status } = req.body;
    // If a file was uploaded, use its location as the new logo
    if (req.file) {
        const file = req.file;
        logo = file.path || file.secure_url || file.location;
    }
    const brand = yield brand_model_1.default.findById(id);
    if (brand) {
        // Check if slug is being updated and if it conflicts with another active/inactive brand
        if (slug && slug !== brand.slug) {
            const existingBrand = yield brand_model_1.default.findOne({ slug, status: { $ne: 0 } });
            if (existingBrand) {
                return res.status(400).json({ message: 'Brand slug already exists' });
            }
        }
        brand.name = name || brand.name;
        brand.slug = slug || brand.slug;
        brand.logo = logo || brand.logo;
        if (status !== undefined)
            brand.status = status;
        try {
            const updatedBrand = yield brand.save();
            res.json(updatedBrand);
        }
        catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Brand slug already exists' });
            }
            res.status(400).json({ message: 'Invalid brand data', error: error.message });
        }
    }
    else {
        res.status(404).json({ message: 'Brand not found' });
    }
});
exports.updateBrand = updateBrand;
// @desc    Delete a brand (Soft delete)
// @route   DELETE /api/admin/brands/:id
// @access  Private/Admin
const deleteBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const brand = yield brand_model_1.default.findById(id);
    if (brand) {
        brand.status = 0; // Soft delete
        yield brand.save();
        res.json({ message: 'Brand removed' });
    }
    else {
        res.status(404).json({ message: 'Brand not found' });
    }
});
exports.deleteBrand = deleteBrand;
