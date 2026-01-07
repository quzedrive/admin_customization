"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const email_config_controller_1 = require("../controllers/email-config.controller");
const router = express_1.default.Router();
// GET /api/settings/email
router.get('/', auth_middleware_1.protect, email_config_controller_1.getEmailConfig);
// PUT /api/settings/email
router.put('/', auth_middleware_1.protect, email_config_controller_1.updateEmailConfig);
exports.default = router;
