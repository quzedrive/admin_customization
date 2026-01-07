"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const image_upload_config_controller_1 = require("../controllers/image-upload-config.controller");
const router = express_1.default.Router();
// GET /api/settings/image-upload
router.get('/', auth_middleware_1.protect, image_upload_config_controller_1.getImageUploadConfig);
// PUT /api/settings/image-upload
router.put('/', auth_middleware_1.protect, image_upload_config_controller_1.updateImageUploadConfig);
exports.default = router;
