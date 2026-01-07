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
exports.updateAppearanceSettings = exports.getAppearanceSettings = void 0;
const appearance_settings_model_1 = __importDefault(require("../models/settings/appearance-settings.model"));
// @desc    Get appearance settings
// @route   GET /api/settings/appearance
// @access  Public (or Private based on requirement, usually public for frontend rendering)
const getAppearanceSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield appearance_settings_model_1.default.getSingleton();
        res.status(200).json(config);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch appearance settings', error: error.message });
    }
});
exports.getAppearanceSettings = getAppearanceSettings;
// @desc    Update appearance settings
// @route   PUT /api/settings/appearance
// @access  Private/Admin
const updateAppearanceSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield appearance_settings_model_1.default.getSingleton();
        const { primaryColor, secondaryColor, iconColor } = req.body;
        config.primaryColor = primaryColor !== null && primaryColor !== void 0 ? primaryColor : config.primaryColor;
        config.secondaryColor = secondaryColor !== null && secondaryColor !== void 0 ? secondaryColor : config.secondaryColor;
        config.iconColor = iconColor !== null && iconColor !== void 0 ? iconColor : config.iconColor;
        yield config.save();
        res.status(200).json(config);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update appearance settings', error: error.message });
    }
});
exports.updateAppearanceSettings = updateAppearanceSettings;
