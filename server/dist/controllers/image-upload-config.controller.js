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
exports.updateImageUploadConfig = exports.getImageUploadConfig = void 0;
const image_upload_config_model_1 = __importDefault(require("../models/image-upload-config.model"));
const encryption_1 = require("../utils/encryption");
const cloudinary_config_1 = require("../config/cloudinary.config");
// @desc    Get image upload configuration
// @route   GET /api/settings/image-upload
// @access  Private/Admin
const getImageUploadConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield image_upload_config_model_1.default.getSingleton();
        const configObj = config.toObject();
        if (configObj.cloudinary && configObj.cloudinary.apiSecret) {
            try {
                const decrypted = (0, encryption_1.decrypt)(configObj.cloudinary.apiSecret);
                configObj.cloudinary.apiSecret = (0, encryption_1.maskSecret)(decrypted);
            }
            catch (e) {
                configObj.cloudinary.apiSecret = '';
            }
        }
        res.status(200).json(configObj);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch image upload config', error: error.message });
    }
});
exports.getImageUploadConfig = getImageUploadConfig;
// @desc    Update image upload configuration
// @route   PUT /api/settings/image-upload
// @access  Private/Admin
const updateImageUploadConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const config = yield image_upload_config_model_1.default.getSingleton();
        const { provider, cloudinary } = req.body;
        config.provider = provider !== null && provider !== void 0 ? provider : config.provider;
        if (cloudinary) {
            config.cloudinary = Object.assign(Object.assign({}, config.cloudinary), { cloudName: (_a = cloudinary.cloudName) !== null && _a !== void 0 ? _a : config.cloudinary.cloudName, apiKey: (_b = cloudinary.apiKey) !== null && _b !== void 0 ? _b : config.cloudinary.apiKey });
            // Handle API Secret Update
            if (cloudinary.apiSecret) {
                let isMasked = false;
                if ((_c = config.cloudinary) === null || _c === void 0 ? void 0 : _c.apiSecret) {
                    try {
                        const decryptedCurrent = (0, encryption_1.decrypt)(config.cloudinary.apiSecret);
                        const maskedCurrent = (0, encryption_1.maskSecret)(decryptedCurrent);
                        if (cloudinary.apiSecret === maskedCurrent) {
                            isMasked = true;
                        }
                    }
                    catch (e) {
                        // ignore
                    }
                }
                if (!isMasked) {
                    config.cloudinary.apiSecret = (0, encryption_1.encrypt)(cloudinary.apiSecret);
                }
            }
        }
        yield config.save();
        // Re-configure Cloudinary immediately with new settings
        yield (0, cloudinary_config_1.configureCloudinary)();
        // Return masked version
        const configObj = config.toObject();
        if (configObj.cloudinary && configObj.cloudinary.apiSecret) {
            const decrypted = (0, encryption_1.decrypt)(configObj.cloudinary.apiSecret);
            configObj.cloudinary.apiSecret = (0, encryption_1.maskSecret)(decrypted);
        }
        res.status(200).json(configObj);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update image upload config', error: error.message });
    }
});
exports.updateImageUploadConfig = updateImageUploadConfig;
