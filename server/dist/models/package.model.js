"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const status_1 = require("../constants/status");
const PackageSchema = new mongoose_1.Schema({
    name: { type: String, required: true }, // Removed unique: true
    time: { type: String, required: true },
    image: { type: String },
    status: { type: Number, default: status_1.status.active, required: true },
}, { collection: 'package', timestamps: true });
// Partial index: name must be unique only if status is NOT 0 (deleted)
PackageSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 0 } } });
const Package = (0, mongoose_1.model)('Package', PackageSchema);
exports.default = Package;
