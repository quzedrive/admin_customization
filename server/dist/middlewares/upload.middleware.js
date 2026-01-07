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
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
// File Filter
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        // Images
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon',
        // Videos
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm',
        // Documents
        'application/pdf'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
    }
};
// Cloudinary Storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        // Determine folder from query param, default to 'uploads/misc'
        const folder = req.query.folder ? `uploads/${req.query.folder}` : 'uploads/misc';
        // Determine resource_type
        let resourceType = 'auto';
        if (file.mimetype.startsWith('image/')) {
            resourceType = 'image';
        }
        else if (file.mimetype.startsWith('video/')) {
            resourceType = 'video';
        }
        return {
            folder: folder,
            resource_type: resourceType,
            public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
            format: file.mimetype === 'image/svg+xml' ? 'svg' : undefined, // Explicitly set format for SVG
        };
    }),
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});
