"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const appearance_settings_controller_1 = require("../controllers/appearance-settings.controller");
const router = express_1.default.Router();
// GET /api/settings/appearance
// Note: We might want GET to be public if it drives the UI theme for guests too. 
// Assuming public for get, private for update.
router.get('/', appearance_settings_controller_1.getAppearanceSettings);
// PUT /api/settings/appearance
router.put('/', auth_middleware_1.protect, appearance_settings_controller_1.updateAppearanceSettings);
exports.default = router;
