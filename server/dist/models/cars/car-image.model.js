"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CarImageSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { collection: 'car_images', timestamps: true });
const CarImage = (0, mongoose_1.model)('CarImage', CarImageSchema);
exports.default = CarImage;
