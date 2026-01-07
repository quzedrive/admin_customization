"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const status_1 = require("../constants/status");
const SystemTemplateSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    smsContent: { type: String, default: '' },
    pushBody: { type: String, default: '' },
    emailSubject: { type: String, default: '' },
    emailContent: { type: String, default: '' },
    status: { type: Number, default: status_1.status.active },
}, { collection: 'system_templates', timestamps: true });
const SystemTemplate = (0, mongoose_1.model)('SystemTemplate', SystemTemplateSchema);
exports.default = SystemTemplate;
