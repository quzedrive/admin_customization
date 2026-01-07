"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const system_template_controller_1 = require("../controllers/system-template.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(auth_middleware_1.protect, system_template_controller_1.getAllTemplates)
    .post(auth_middleware_1.protect, system_template_controller_1.createTemplate);
router.route('/:id')
    .get(auth_middleware_1.protect, system_template_controller_1.getTemplateById)
    .put(auth_middleware_1.protect, system_template_controller_1.updateTemplate)
    .delete(auth_middleware_1.protect, system_template_controller_1.deleteTemplate);
exports.default = router;
