"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessAndRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessAndRefreshToken = (res, payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || '15m'),
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '7d'),
    });
    // Set Refresh Token as HTTP-Only cookie
    res.cookie('qq_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (should match REFRESH_TOKEN_EXPIRY)
    });
    return { accessToken, refreshToken };
};
exports.generateAccessAndRefreshToken = generateAccessAndRefreshToken;
