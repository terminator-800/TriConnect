import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ROLE } from '../utils/roles.js';

export type Role = typeof ROLE[keyof typeof ROLE];

export interface AuthenticatedUser {
    user_id: number;
    email: string;
    role: Role;
    is_registered: boolean | 0 | 1;
}

// Extend Express Request with `user`
export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

// Type for expected JWT payload
interface JwtPayload {
    user_id: number;
    email: string;
    role: Role;
    is_registered: boolean | 0 | 1;
}

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;

    if (!token) {
        console.log(`[AUTH FAILED] No token provided for ${req.method} ${req.originalUrl}`);
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;

        // Type-safe assignment
        req.user = {
            user_id: decoded.user_id,
            email: decoded.email,
            role: decoded.role,
            is_registered: decoded.is_registered,
        };

        console.log(
            `[AUTH OK] User ${decoded.user_id} (${decoded.role}) accessed ${req.method} ${req.originalUrl}`
        );

        next();
    } catch (error: any) {
        console.log(`[AUTH FAILED] Invalid token for ${req.method} ${req.originalUrl}:`, error.message);
        res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
};
