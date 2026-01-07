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
exports.resetPassword = exports.forgotPassword = exports.registerAdmin = exports.logoutAdmin = exports.getMe = exports.refreshAccessToken = exports.loginAdmin = void 0;
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const administrator_model_1 = __importDefault(require("../models/administrator.model"));
const system_template_model_1 = __importDefault(require("../models/system-template.model"));
const token_util_1 = require("../utils/token.util");
const status_1 = require("../constants/status");
// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield administrator_model_1.default.findOne({ email });
    if (admin && (yield admin.comparePassword(password))) {
        // Ensure admin is active
        if (admin.status !== status_1.status.active) {
            return res.status(401).json({ message: 'Account is inactive' });
        }
        const { accessToken } = (0, token_util_1.generateAccessAndRefreshToken)(res, {
            id: admin._id.toString(),
            email: admin.email,
            role: admin.role,
        });
        res.json({
            message: 'Login successful',
            qq_access_token: accessToken, // Frontend expects this key
            admin: {
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        });
    }
    else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});
exports.loginAdmin = loginAdmin;
// @desc    Refresh access token
// @route   POST /api/admin/refresh
// @access  Public (Validated via Cookie)
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.qq_refresh_token;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key');
        // Optional: Check if user still exists/active (extra security)
        // const admin = await Administrator.findById(decoded.id);
        // if (!admin) return res.status(401).json({ message: 'User not found' });
        // Generate new tokens
        // Note: We can rotate refresh token here too if we want, or just issue new access token.
        // For simplicity matching previous logic, we issue a new access token. 
        // We reuse the utility which sets the cookie again (Rotating refresh token).
        const payload = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        // This utility rotates the refresh token (sets a new cookie). 
        // If we ONLY want new access token and keep old refresh token, logic would be different.
        // But rotation is safer.
        const { accessToken } = (0, token_util_1.generateAccessAndRefreshToken)(res, payload);
        res.json({
            message: 'Token refreshed successfully',
            qq_access_token: accessToken,
        });
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
});
exports.refreshAccessToken = refreshAccessToken;
// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = {
        _id: req.admin._id,
        username: req.admin.username,
        email: req.admin.email,
        role: req.admin.role,
    };
    res.status(200).json({ admin });
});
exports.getMe = getMe;
// @desc    Logout admin / clear cookie
// @route   POST /api/admin/logout
// @access  Private
const logoutAdmin = (req, res) => {
    res.cookie('qq_refresh_token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logoutAdmin = logoutAdmin;
// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, role } = req.body;
    const adminExists = yield administrator_model_1.default.findOne({ email });
    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }
    const admin = yield administrator_model_1.default.create({
        username,
        email,
        password,
        role: role || 'admin',
        status: status_1.status.active,
    });
    if (admin) {
        // Generate tokens for immediate login
        const { accessToken } = (0, token_util_1.generateAccessAndRefreshToken)(res, {
            id: admin._id.toString(),
            email: admin.email,
            role: admin.role,
        });
        res.status(201).json({
            message: 'Admin registered successfully',
            qq_access_token: accessToken,
            admin: {
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        });
    }
    else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
});
exports.registerAdmin = registerAdmin;
// @desc    Forgot Password
// @route   POST /api/admin/forgotpassword
// @access  Public
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const admin = yield administrator_model_1.default.findOne({ email });
    if (!admin) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Get reset token
    const resetToken = admin.getResetPasswordToken();
    yield admin.save({ validateBeforeSave: false });
    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password/${resetToken}`;
    // CHECK FOR SYSTEM TEMPLATE
    const template = yield system_template_model_1.default.findOne({ slug: 'reset_password' });
    // Only send if template exists and is active
    if (!template || template.status !== status_1.status.active) {
        // Optionally, logic to decide if we should fallback. 
        // User instruction: "if not no need to send it" -> implies abort if not ready.
        // However, simply returning success without sending might be safer to avoid leaking info,
        // OR returning a clear message if this is strictly for admin setup testing.
        // Let's assume we just return success but don't actually send email (mock success), 
        // or specific error. Given context, I'll log and return.
        console.log('Reset Password: Template not found or inactive. Skipping email.');
        return res.status(200).json({ success: true, data: 'Email sending skipped (Template inactive)' });
    }
    // Prepare content
    let subject = template.emailSubject;
    let message = template.emailContent;
    // Replace variables
    // Standard replacements: {{link}} -> resetUrl, {{expire}} -> "10 minutes"
    message = message.replace(/{{link}}/g, resetUrl);
    message = message.replace(/{{expire}}/g, '10 minutes');
    // Also support {{name}} if needed
    message = message.replace(/{{name}}/g, admin.username || 'Admin');
    try {
        yield (0, sendEmail_1.default)({
            email: admin.email,
            subject: subject,
            message: 'Please use an HTML supported client', // Plain text fallback
            html: message
        });
        res.status(200).json({ success: true, data: 'Email sent' });
    }
    catch (error) {
        console.log(error);
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        yield admin.save({ validateBeforeSave: false });
        return res.status(500).json({ message: 'Email could not be sent' });
    }
});
exports.forgotPassword = forgotPassword;
// @desc    Reset Password
// @route   PUT /api/admin/resetpassword/:resettoken
// @access  Public
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get hashed token
    const resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
    const admin = yield administrator_model_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
    });
    if (!admin) {
        return res.status(400).json({ message: 'Invalid token' });
    }
    // Set new password
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    yield admin.save();
    // Generate tokens for immediate login
    const { accessToken } = (0, token_util_1.generateAccessAndRefreshToken)(res, {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
    });
    res.status(200).json({
        success: true,
        data: 'Password updated successfully',
        qq_access_token: accessToken,
    });
});
exports.resetPassword = resetPassword;
