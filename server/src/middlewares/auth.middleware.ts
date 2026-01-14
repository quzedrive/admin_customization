import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Administrator from '../models/administrator.model';

interface AuthRequest extends Request {
    admin?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    // Check for Access Token in Authorization Header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

            req.admin = await Administrator.findById(decoded.id).select('-password');
            if (!req.admin) {
                return res.status(401).json({ message: 'Not authorized, admin not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.admin) { // Assuming if they pass protect() and have admin obj, they are admin. Add role check if schema supports it.
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
