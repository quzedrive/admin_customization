"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const site_settings_controller_1 = require("../controllers/site-settings.controller");
const router = (0, express_1.Router)();
// Public Get
router.get('/', site_settings_controller_1.getSettings);
// Protected Updates
router.put('/general', auth_middleware_1.protect, site_settings_controller_1.updateGeneral);
router.put('/contact', auth_middleware_1.protect, site_settings_controller_1.updateContact);
router.put('/social', auth_middleware_1.protect, site_settings_controller_1.updateSocial);
router.put('/seo', auth_middleware_1.protect, site_settings_controller_1.updateSeo);
router.put('/maintenance', auth_middleware_1.protect, site_settings_controller_1.updateMaintenance);
exports.default = router;
