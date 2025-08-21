import type { Request, Response, NextFunction } from 'express';
import { ROLE } from '../utils/roles.js';

export type Role = typeof ROLE[keyof typeof ROLE];

export interface RegisterRequestBody {
    email: string;
    password: string;
    role: Role;
}

export function validateRegisterInput(
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response,
    next: NextFunction
) {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Missing email, password, or role' });
    }

    const allowedRoles: Role[] = Object.values(ROLE);
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    console.log('Middleware validating registration input:', { email, role });
    next();
}
