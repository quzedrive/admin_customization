import rateLimit, { Store, ClientRateLimitInfo, Options } from 'express-rate-limit';
import { ApiError } from '../utils/ApiError';
import { httpStatus } from '../constants/http-status';
import { RateLimit } from '../models/rate-limit.model';

/**
 * Custom MongoDB-backed store for express-rate-limit
 */
class MongoStore implements Store {
    config: Options | undefined;

    async init(options: Options) {
        this.config = options;
    }

    async increment(key: string): Promise<ClientRateLimitInfo> {
        const now = new Date();
        const windowMs = this.config?.windowMs || 15 * 60 * 1000;
        const resetTime = new Date(now.getTime() + windowMs);

        // Atomic find and update or create
        const record = await RateLimit.findOneAndUpdate(
            { key },
            {
                $inc: { hits: 1 },
                $setOnInsert: { resetTime }
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        return {
            totalHits: record!.hits,
            resetTime: record!.resetTime
        };
    }

    async decrement(key: string): Promise<void> {
        await RateLimit.updateOne({ key }, { $inc: { hits: -1 } });
    }

    async resetKey(key: string): Promise<void> {
        await RateLimit.deleteOne({ key });
    }
}

/**
 * Rate limiter for sensitive authentication routes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many attempts from this IP, please try again after 15 minutes',
        statusCode: httpStatus.TOO_MANY_REQUESTS
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new MongoStore(),
    handler: (req, res, next, options) => {
        next(new ApiError(options.statusCode, options.message.message));
    }
});

/**
 * Rate limiter for order tracking searches
 */
export const trackOrderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 searches per windowMs
    message: {
        success: false,
        message: 'Too many order tracking attempts from this IP, please try again after 15 minutes',
        statusCode: httpStatus.TOO_MANY_REQUESTS
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new MongoStore(),
    handler: (req, res, next, options) => {
        next(new ApiError(options.statusCode, options.message.message));
    }
});
