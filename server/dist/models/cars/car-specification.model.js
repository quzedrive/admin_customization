"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CarSpecificationSchema = new mongoose_1.Schema({
    icon: { type: String, required: true },
    text: { type: String, required: true },
}, { collection: 'car_specifications', timestamps: true });
const CarSpecification = (0, mongoose_1.model)('CarSpecification', CarSpecificationSchema);
exports.default = CarSpecification;
