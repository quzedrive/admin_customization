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
exports.configureCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const image_upload_config_model_1 = __importDefault(require("../models/image-upload-config.model"));
const encryption_1 = require("../utils/encryption");
const configureCloudinary = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield image_upload_config_model_1.default.getSingleton();
        if (config && config.cloudinary && config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
            let apiSecret = config.cloudinary.apiSecret;
            // Try to decrypt if it looks encrypted (contains colon)
            // Note: simple check, encryption util usually produces hex:hex
            if (apiSecret.includes(':')) {
                try {
                    apiSecret = (0, encryption_1.decrypt)(apiSecret);
                }
                catch (e) {
                    // console.error("Failed to decrypt cloudinary secret", e);
                }
            }
            cloudinary_1.v2.config({
                cloud_name: config.cloudinary.cloudName,
                api_key: config.cloudinary.apiKey,
                api_secret: apiSecret
            });
        }
        else {
            // Fallback to env or log warning
            // console.log("Cloudinary config missing in DB, using existing/env if available");
        }
    }
    catch (error) {
        console.error("Failed to configure Cloudinary from DB:", error);
    }
});
exports.configureCloudinary = configureCloudinary;
exports.default = cloudinary_1.v2;
