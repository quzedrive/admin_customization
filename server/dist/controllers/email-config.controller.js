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
exports.updateEmailConfig = exports.getEmailConfig = void 0;
const email_config_model_1 = __importDefault(require("../models/email-config.model"));
const encryption_1 = require("../utils/encryption");
// @desc    Get email configuration
// @route   GET /api/settings/email
// @access  Private/Admin
const getEmailConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield email_config_model_1.default.getSingleton();
        const configObj = config.toObject();
        // Reveal only prefix of password
        if (configObj.pass) {
            try {
                const decrypted = (0, encryption_1.decrypt)(configObj.pass);
                configObj.pass = (0, encryption_1.maskSecret)(decrypted);
            }
            catch (e) {
                configObj.pass = ''; // Clear if decryption fails
            }
        }
        res.status(200).json(configObj);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch email config', error: error.message });
    }
});
exports.getEmailConfig = getEmailConfig;
// @desc    Update email configuration
// @route   PUT /api/settings/email
// @access  Private/Admin
const updateEmailConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield email_config_model_1.default.getSingleton();
        const { host, port, user, pass, secure, fromEmail, fromName } = req.body;
        config.host = host !== null && host !== void 0 ? host : config.host;
        config.port = port !== null && port !== void 0 ? port : config.port;
        config.user = user !== null && user !== void 0 ? user : config.user;
        config.secure = secure !== null && secure !== void 0 ? secure : config.secure;
        config.fromEmail = fromEmail !== null && fromEmail !== void 0 ? fromEmail : config.fromEmail;
        config.fromName = fromName !== null && fromName !== void 0 ? fromName : config.fromName;
        // Handle Password Update
        if (pass) {
            // Check if pass is the masked version (starts with 5 chars + 10 asterisks)
            let isMasked = false;
            if (config.pass) {
                try {
                    const decryptedCurrent = (0, encryption_1.decrypt)(config.pass);
                    const maskedCurrent = (0, encryption_1.maskSecret)(decryptedCurrent);
                    if (pass === maskedCurrent) {
                        isMasked = true;
                    }
                }
                catch (e) {
                    // ignore decryption error
                }
            }
            // Only update if it's NOT the masked version (meaning user typed a new password)
            if (!isMasked) {
                config.pass = (0, encryption_1.encrypt)(pass);
            }
        }
        yield config.save();
        // Return masked version
        const configObj = config.toObject();
        if (configObj.pass) {
            const decrypted = (0, encryption_1.decrypt)(configObj.pass);
            configObj.pass = (0, encryption_1.maskSecret)(decrypted);
        }
        res.status(200).json(configObj);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update email config', error: error.message });
    }
});
exports.updateEmailConfig = updateEmailConfig;
