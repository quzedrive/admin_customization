import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError';
import { httpStatus } from '../constants/http-status';

/**
 * Rate limiter for sensitive authentication routes
 * Limits requests from a single IP to prevent brute-force attacks
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many attempts from this IP, please try again after 15 minutes',
        statusCode: httpStatus.TOO_MANY_REQUESTS
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Custom handler to use our ApiError structure
    handler: (req, res, next, options) => {
        next(new ApiError(options.statusCode, options.message.message));
    }
});

/**
 * Rate limiter for order tracking searches
 * Limits wrong searches to prevent scraping or brute-force
 */
export const trackOrderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 searches per windowMs
    message: {
        success: false,
        message: 'Too many order tracking attempts from this IP, please try again after 15 minutes',
        statusCode: httpStatus.TOO_MANY_REQUESTS
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        next(new ApiError(options.statusCode, options.message.message));
    }
});
