"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("../controllers/brand.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = express_1.default.Router();
// Public: Get active brands
router.get('/', brand_controller_1.getPublicBrands);
// Admin: Get all brands (with pagination/search/status)
router.get('/admin', auth_middleware_1.protect, brand_controller_1.getAdminBrands);
// Admin: Create new brand
router.post('/admin', auth_middleware_1.protect, upload_middleware_1.upload.single('logo'), brand_controller_1.createBrand);
// Admin: Update brand
router.put('/admin/:id', auth_middleware_1.protect, upload_middleware_1.upload.single('logo'), brand_controller_1.updateBrand);
// Admin: Delete brand (Soft delete)
router.delete('/admin/:id', auth_middleware_1.protect, brand_controller_1.deleteBrand);
exports.default = router;
