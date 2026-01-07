"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const package_controller_1 = require("../controllers/package.controller");
const router = express_1.default.Router();
// Public Routes
router.get('/', package_controller_1.getPublicPackages);
// Admin Routes
router.get('/admin', auth_middleware_1.protect, package_controller_1.getAdminPackages);
router.post('/admin', auth_middleware_1.protect, upload_middleware_1.upload.single('image'), package_controller_1.createPackage);
router.get('/admin/:id', auth_middleware_1.protect, package_controller_1.getPackageById);
router.put('/admin/:id', auth_middleware_1.protect, upload_middleware_1.upload.single('image'), package_controller_1.updatePackage);
router.delete('/admin/:id', auth_middleware_1.protect, package_controller_1.deletePackage);
exports.default = router;
