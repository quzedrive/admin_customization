import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

export const generateAccessAndRefreshToken = (res: Response, payload: TokenPayload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || '15m') as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as jwt.SignOptions['expiresIn'],
    });

    // Set Refresh Token as HTTP-Only cookie
    res.cookie('qq_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // Only set domain in production to prevent cookie sharing between environments
        ...(process.env.NODE_ENV === 'production' && process.env.COOKIE_DOMAIN
            ? { domain: process.env.COOKIE_DOMAIN }
            : {}),
    });

    return { accessToken, refreshToken };
};
