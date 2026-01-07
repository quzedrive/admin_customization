"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const status_1 = require("../../constants/status");
const CarSchema = new mongoose_1.Schema({
    brand: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }, // e.g. Sedan, SUV
    transmission: { type: String, required: true }, // e.g. Automatic, Manual
    fuelType: { type: String, required: true }, // e.g. Petrol, Diesel, Electric
    seatingCapacity: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    hourlyCharge: { type: Number, required: true },
    additionalHourlyCharge: { type: Number, required: true },
    images: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'CarImage' }],
    packages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'CarPackage' }],
    description: { type: String, default: '' },
    specifications: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'CarSpecification' }],
    status: { type: Number, default: status_1.status.active },
}, { collection: 'cars', timestamps: true });
const Car = (0, mongoose_1.model)('Car', CarSchema);
exports.default = Car;
