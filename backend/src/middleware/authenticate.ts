import type { Request, Response, NextFunction } from 'express';
import { ROLE } from '../utils/roles.js';
import jwt from 'jsonwebtoken';

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
    let token = req.cookies?.token;

    // Fallback: Check Authorization header (from localStorage in frontend)
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;

        req.user = {
            user_id: decoded.user_id,
            email: decoded.email,
            role: decoded.role,
            is_registered: decoded.is_registered,
        };

        next();
    } catch (error: any) {
        res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
};
