import type { Request, Response, NextFunction } from 'express';
import { ROLE } from '../utils/roles.js';
import logger from '../config/logger.js';

export type Role = typeof ROLE[keyof typeof ROLE];

export interface RegisterRequestBody {
    email: string;
    password: string;
    role: Role;
}

export function validateRegisterInput(req: Request<{}, {}, RegisterRequestBody>, res: Response, next: NextFunction) {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Missing email, password, or role' });
        }

        const allowedRoles: Role[] = Object.values(ROLE);

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        next();
    } catch (error) {
        logger.error('Error in validateRegisterInput middleware', { error, body: req.body });
        return res.status(500).json({ message: 'Server error in input validation' });
    }

}
