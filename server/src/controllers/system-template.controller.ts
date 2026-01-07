import { Request, Response } from 'express';
import SystemTemplate from '../models/system-template.model';
import { status } from '../constants/status';

// @desc    Get all templates
// @route   GET /api/templates
// @access  Private
export const getAllTemplates = async (req: Request, res: Response) => {
    try {
        const templates = await SystemTemplate.find({ status: { $ne: status.deleted } }).sort({ createdAt: -1 });
        res.status(200).json(templates);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Private
export const getTemplateById = async (req: Request, res: Response) => {
    try {
        const template = await SystemTemplate.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.status(200).json(template);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create template
// @route   POST /api/templates
// @access  Private
export const createTemplate = async (req: Request, res: Response) => {
    try {
        const { name, slug, smsContent, pushBody, emailSubject, emailContent, status } = req.body;

        const existingTemplate = await SystemTemplate.findOne({ slug });
        if (existingTemplate) {
            return res.status(400).json({ message: 'Template with this slug already exists' });
        }

        const template = await SystemTemplate.create({
            name,
            slug,
            smsContent,
            pushBody,
            emailSubject,
            emailContent,
            status
        });

        res.status(201).json(template);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private
export const updateTemplate = async (req: Request, res: Response) => {
    try {
        const template = await SystemTemplate.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        const { name, slug, smsContent, pushBody, emailSubject, emailContent, status } = req.body;

        // If slug is changed, check uniqueness
        if (slug && slug !== template.slug) {
            const existingTemplate = await SystemTemplate.findOne({ slug });
            if (existingTemplate) {
                return res.status(400).json({ message: 'Template with this slug already exists' });
            }
        }

        template.name = name || template.name;
        template.slug = slug || template.slug;
        template.smsContent = smsContent ?? template.smsContent;
        template.pushBody = pushBody ?? template.pushBody;
        template.emailSubject = emailSubject ?? template.emailSubject;
        template.emailContent = emailContent ?? template.emailContent;
        template.status = status ?? template.status;

        const updatedTemplate = await template.save();
        res.status(200).json(updatedTemplate);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
export const deleteTemplate = async (req: Request, res: Response) => {
    try {
        const template = await SystemTemplate.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        template.status = status.deleted;
        await template.save();
        res.status(200).json({ message: 'Template removed (soft delete)' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
