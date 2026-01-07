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
exports.deleteTemplate = exports.updateTemplate = exports.createTemplate = exports.getTemplateById = exports.getAllTemplates = void 0;
const system_template_model_1 = __importDefault(require("../models/system-template.model"));
const status_1 = require("../constants/status");
// @desc    Get all templates
// @route   GET /api/templates
// @access  Private
const getAllTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = yield system_template_model_1.default.find({ status: { $ne: status_1.status.deleted } }).sort({ createdAt: -1 });
        res.status(200).json(templates);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllTemplates = getAllTemplates;
// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Private
const getTemplateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield system_template_model_1.default.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.status(200).json(template);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTemplateById = getTemplateById;
// @desc    Create template
// @route   POST /api/templates
// @access  Private
const createTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, smsContent, pushBody, emailSubject, emailContent, status } = req.body;
        const existingTemplate = yield system_template_model_1.default.findOne({ slug });
        if (existingTemplate) {
            return res.status(400).json({ message: 'Template with this slug already exists' });
        }
        const template = yield system_template_model_1.default.create({
            name,
            slug,
            smsContent,
            pushBody,
            emailSubject,
            emailContent,
            status
        });
        res.status(201).json(template);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createTemplate = createTemplate;
// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private
const updateTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield system_template_model_1.default.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        const { name, slug, smsContent, pushBody, emailSubject, emailContent, status } = req.body;
        // If slug is changed, check uniqueness
        if (slug && slug !== template.slug) {
            const existingTemplate = yield system_template_model_1.default.findOne({ slug });
            if (existingTemplate) {
                return res.status(400).json({ message: 'Template with this slug already exists' });
            }
        }
        template.name = name || template.name;
        template.slug = slug || template.slug;
        template.smsContent = smsContent !== null && smsContent !== void 0 ? smsContent : template.smsContent;
        template.pushBody = pushBody !== null && pushBody !== void 0 ? pushBody : template.pushBody;
        template.emailSubject = emailSubject !== null && emailSubject !== void 0 ? emailSubject : template.emailSubject;
        template.emailContent = emailContent !== null && emailContent !== void 0 ? emailContent : template.emailContent;
        template.status = status !== null && status !== void 0 ? status : template.status;
        const updatedTemplate = yield template.save();
        res.status(200).json(updatedTemplate);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateTemplate = updateTemplate;
// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
const deleteTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield system_template_model_1.default.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        template.status = status_1.status.deleted;
        yield template.save();
        res.status(200).json({ message: 'Template removed (soft delete)' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteTemplate = deleteTemplate;
