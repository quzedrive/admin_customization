import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Administrator from '../models/administrator.model';
import SystemTemplate from '../models/system-template.model';
import { generateAccessAndRefreshToken } from '../utils/token.util';
import { status } from '../constants/status';

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const admin = await Administrator.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
        // Ensure admin is active
        if (admin.status !== status.active) {
            return res.status(401).json({ message: 'Account is inactive' });
        }

        const { accessToken } = generateAccessAndRefreshToken(res, {
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
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Refresh access token
// @route   POST /api/admin/refresh
// @access  Public (Validated via Cookie)
export const refreshAccessToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.qq_refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
    }

    try {
        const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key');

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
        const { accessToken } = generateAccessAndRefreshToken(res, payload);

        res.json({
            message: 'Token refreshed successfully',
            qq_access_token: accessToken,
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private
export const getMe = async (req: any, res: Response) => {
    const admin = {
        _id: req.admin._id,
        username: req.admin.username,
        email: req.admin.email,
        role: req.admin.role,
    };
    res.status(200).json({ admin });
};

// @desc    Logout admin / clear cookie
// @route   POST /api/admin/logout
// @access  Private
export const logoutAdmin = (req: Request, res: Response) => {
    res.cookie('qq_refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: new Date(0),
        // Only set domain in production to match the cookie that was set
        ...(process.env.NODE_ENV === 'production' && process.env.COOKIE_DOMAIN
            ? { domain: process.env.COOKIE_DOMAIN }
            : {}),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
export const registerAdmin = async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    const adminExists = await Administrator.findOne({ email });

    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Administrator.create({
        username,
        email,
        password,
        role: role || 'admin',
        status: status.active,
    });

    if (admin) {
        // Generate tokens for immediate login
        const { accessToken } = generateAccessAndRefreshToken(res, {
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
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

// @desc    Forgot Password
// @route   POST /api/admin/forgotpassword
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const admin = await Administrator.findOne({ email });

    if (!admin) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Get reset token
    const resetToken = admin.getResetPasswordToken();
    await admin.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password/${resetToken}`;

    // CHECK FOR SYSTEM TEMPLATE
    const template = await SystemTemplate.findOne({ slug: 'reset_password' });

    // Only send if template exists and is active
    if (!template || template.status !== status.active) {
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
        await sendEmail({
            email: admin.email,
            subject: subject,
            message: 'Please use an HTML supported client', // Plain text fallback
            html: message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (error) {
        console.log(error);
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;

        await admin.save({ validateBeforeSave: false });

        return res.status(500).json({ message: 'Email could not be sent' });
    }
};

// @desc    Reset Password
// @route   PUT /api/admin/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const admin = await Administrator.findOne({
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

    await admin.save();

    // Generate tokens for immediate login
    const { accessToken } = generateAccessAndRefreshToken(res, {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
    });

    res.status(200).json({
        success: true,
        data: 'Password updated successfully',
        qq_access_token: accessToken,
    });
};
