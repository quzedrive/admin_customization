"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CarPackageSchema = new mongoose_1.Schema({
    car: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Car', required: true },
    package: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Package', required: true },
    price: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
}, { collection: 'car_packages', timestamps: true });
const CarPackage = (0, mongoose_1.model)('CarPackage', CarPackageSchema);
exports.default = CarPackage;
