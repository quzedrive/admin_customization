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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EmailConfigSchema = new mongoose_1.Schema({
    host: { type: String, default: '' },
    port: { type: Number, default: 587 },
    user: { type: String, default: '' },
    pass: { type: String, default: '' },
    secure: { type: Boolean, default: false },
    fromEmail: { type: String, default: '' },
    fromName: { type: String, default: '' },
}, { collection: 'email_config', timestamps: true });
// Ensure there's only one document (singleton)
EmailConfigSchema.statics.getSingleton = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let config = yield this.findOne();
        if (!config) {
            config = yield this.create({});
        }
        return config;
    });
};
const EmailConfig = (0, mongoose_1.model)('EmailConfig', EmailConfigSchema);
exports.default = EmailConfig;
