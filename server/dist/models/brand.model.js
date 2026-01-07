"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const status_1 = require("../constants/status");
const BrandSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    logo: { type: String },
    status: { type: Number, default: status_1.status.active, required: true },
}, { collection: 'brand', timestamps: true });
// Add partial unique index for slug where status is not 0 (deleted)
BrandSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 0 } } });
const Brand = (0, mongoose_1.model)('Brand', BrandSchema);
exports.default = Brand;
