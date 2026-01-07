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
exports.updateMaintenance = exports.updateSeo = exports.updateSocial = exports.updateContact = exports.updateGeneral = exports.getSettings = void 0;
const site_settings_model_1 = __importDefault(require("../models/settings/site-settings.model"));
// Helper to get the single settings document
const getSettingsDocument = () => __awaiter(void 0, void 0, void 0, function* () {
    let settings = yield site_settings_model_1.default.findOne();
    if (!settings) {
        settings = yield site_settings_model_1.default.create({});
    }
    return settings;
});
// @desc    Get site settings
// @route   GET /api/settings
// @access  Public (or Private depending on needs, usually public for frontend)
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield getSettingsDocument();
        res.status(200).json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
    }
});
exports.getSettings = getSettings;
// @desc    Update General Section (Identity + Logos)
// @route   PUT /api/settings/general
// @access  Private/Admin
const updateGeneral = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Update General Body:', req.body); // DEBUG LOG
        const settings = yield getSettingsDocument();
        const { siteTitle, description, keywords, lightLogo, darkLogo, favicon } = req.body;
        settings.general = Object.assign(Object.assign({}, settings.general), { siteTitle: siteTitle !== null && siteTitle !== void 0 ? siteTitle : settings.general.siteTitle, description: description !== null && description !== void 0 ? description : settings.general.description, keywords: keywords !== null && keywords !== void 0 ? keywords : settings.general.keywords, lightLogo: lightLogo !== null && lightLogo !== void 0 ? lightLogo : settings.general.lightLogo, darkLogo: darkLogo !== null && darkLogo !== void 0 ? darkLogo : settings.general.darkLogo, favicon: favicon !== null && favicon !== void 0 ? favicon : settings.general.favicon });
        yield settings.save();
        res.status(200).json(settings.general);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update general settings', error: error.message });
    }
});
exports.updateGeneral = updateGeneral;
// @desc    Update Contact Section
// @route   PUT /api/settings/contact
// @access  Private/Admin
const updateContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield getSettingsDocument();
        const { email, phone, address, mapUrl } = req.body;
        settings.contact = Object.assign(Object.assign({}, settings.contact), { email: email !== null && email !== void 0 ? email : settings.contact.email, phone: phone !== null && phone !== void 0 ? phone : settings.contact.phone, address: address !== null && address !== void 0 ? address : settings.contact.address, mapUrl: mapUrl !== null && mapUrl !== void 0 ? mapUrl : settings.contact.mapUrl });
        yield settings.save();
        res.status(200).json(settings.contact);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update contact settings', error: error.message });
    }
});
exports.updateContact = updateContact;
// @desc    Update Social Section
// @route   PUT /api/settings/social
// @access  Private/Admin
const updateSocial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield getSettingsDocument();
        const { facebook, twitter, instagram, linkedin, youtube } = req.body;
        settings.social = Object.assign(Object.assign({}, settings.social), { facebook: facebook !== null && facebook !== void 0 ? facebook : settings.social.facebook, twitter: twitter !== null && twitter !== void 0 ? twitter : settings.social.twitter, instagram: instagram !== null && instagram !== void 0 ? instagram : settings.social.instagram, linkedin: linkedin !== null && linkedin !== void 0 ? linkedin : settings.social.linkedin, youtube: youtube !== null && youtube !== void 0 ? youtube : settings.social.youtube });
        yield settings.save();
        res.status(200).json(settings.social);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update social settings', error: error.message });
    }
});
exports.updateSocial = updateSocial;
// @desc    Update SEO Section
// @route   PUT /api/settings/seo
// @access  Private/Admin
const updateSeo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield getSettingsDocument();
        const { metaTitle, metaDescription, ogImage } = req.body;
        settings.seo = Object.assign(Object.assign({}, settings.seo), { metaTitle: metaTitle !== null && metaTitle !== void 0 ? metaTitle : settings.seo.metaTitle, metaDescription: metaDescription !== null && metaDescription !== void 0 ? metaDescription : settings.seo.metaDescription, ogImage: ogImage !== null && ogImage !== void 0 ? ogImage : settings.seo.ogImage });
        yield settings.save();
        res.status(200).json(settings.seo);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update SEO settings', error: error.message });
    }
});
exports.updateSeo = updateSeo;
// @desc    Update Maintenance Section
// @route   PUT /api/settings/maintenance
// @access  Private/Admin
const updateMaintenance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield getSettingsDocument();
        const { status, title, message } = req.body;
        settings.maintenance = Object.assign(Object.assign({}, settings.maintenance), { status: status !== undefined ? status : settings.maintenance.status, title: title !== null && title !== void 0 ? title : settings.maintenance.title, message: message !== null && message !== void 0 ? message : settings.maintenance.message });
        yield settings.save();
        res.status(200).json(settings.maintenance);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update maintenance settings', error: error.message });
    }
});
exports.updateMaintenance = updateMaintenance;
