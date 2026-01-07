"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_middleware_1 = require("../middlewares/upload.middleware");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Upload route
// Uses 'file' as the form-data key
router.post('/', auth_middleware_1.protect, upload_middleware_1.upload.single('file'), upload_controller_1.uploadFile);
exports.default = router;
