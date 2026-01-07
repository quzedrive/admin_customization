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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = __importDefault(require("crypto"));
const status_1 = require("../constants/status");
const AdministratorSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin', required: true },
    status: { type: Number, default: status_1.status.active, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { collection: 'administrator', timestamps: true });
// Hash password before saving
AdministratorSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = this;
        if (!admin.isModified('password')) {
            return;
        }
        // No try/catch needed, async errors bubble up automatically
        admin.password = yield (0, bcryptjs_1.hash)(admin.password, 12);
    });
});
// Method to compare password
AdministratorSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, bcryptjs_1.compare)(password, this.password);
    });
};
// Generate and hash password reset token
AdministratorSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // Set expire time (e.g., 10 minutes)
    this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
};
const Administrator = (0, mongoose_1.model)('Administrator', AdministratorSchema);
exports.default = Administrator;
