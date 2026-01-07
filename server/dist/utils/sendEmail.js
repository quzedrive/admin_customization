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
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_config_model_1 = __importDefault(require("../models/email-config.model"));
const encryption_1 = require("./encryption");
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Fetch Email Config
    const config = yield email_config_model_1.default.getSingleton();
    if (!config.host || !config.user || !config.pass) {
        throw new Error('SMTP Settings not configured. Please contact the administrator.');
    }
    // 2. Decrypt Password
    let smtpPassword = config.pass;
    if (config.pass.includes(':')) {
        try {
            smtpPassword = (0, encryption_1.decrypt)(config.pass);
        }
        catch (e) {
            console.error('Failed to decrypt SMTP password', e);
            throw new Error('SMTP Configuration Error');
        }
    }
    // 3. Create Transporter
    const transporter = nodemailer_1.default.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure, // true for 465, false for other ports
        auth: {
            user: config.user,
            pass: smtpPassword,
        },
    });
    // 4. Define Email Options
    const mailOptions = {
        from: `"${config.fromName || 'Admin Support'}" <${config.fromEmail || config.user}>`,
        to: options.email,
        subject: options.subject,
        text: options.message, // Fallback plain text
        html: options.html || options.message.replace(/\n/g, '<br>'), // HTML content or converted text
    };
    // 5. Send Email
    yield transporter.sendMail(mailOptions);
});
exports.default = sendEmail;
