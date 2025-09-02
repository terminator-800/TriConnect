import type { Pool, PoolConnection } from "mysql2/promise";
import type { JwtPayload } from "jsonwebtoken";
import { ROLE } from "../utils/roles.js";
import jwt from "jsonwebtoken";

type Role = typeof ROLE[keyof typeof ROLE];

const allowedRoles: Role[] = [
    ROLE.BUSINESS_EMPLOYER,
    ROLE.INDIVIDUAL_EMPLOYER,
    ROLE.MANPOWER_PROVIDER,
    ROLE.JOBSEEKER,
    ROLE.ADMINISTRATOR
];

interface TokenPayload extends JwtPayload {
    user_id: number;
    email: string;
    role: Role;
    is_registered: boolean | 0 | 1;
}

export interface UserRecord {
    user_id: number;
    email: string;
    role: Role;
    is_registered: boolean | 0 | 1;
}

/**
 * Verifies a JWT token and ensures the user exists and has allowed role.
 */
export const secureVerifyToken = async (
    token: string,
    getUser: (user_id: number) => Promise<UserRecord | null>
): Promise<{ user_id: number; role: Role }> => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    const { user_id, email, role, is_registered } = decoded;

    if (!user_id || !email || !role) {
        throw new Error("Missing critical token fields.");
    }

    if (!is_registered) throw new Error("User is not registered.");

    if (!allowedRoles.includes(role)) {
        throw new Error("Role not authorized to perform this action.");
    }

    const user: UserRecord | null = await getUser(user_id);

    if (
        !user ||
        user.email !== email ||
        user.role !== role ||
        user.is_registered !== is_registered
    ) {
        throw new Error("Token data does not match database record.");
    }

    return { user_id, role };
};

/**
 * Fetches a user record by ID from a MySQL pool.
 */
export async function getUserInfo(pool: Pool, user_id: number): Promise<UserRecord | null> {
    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();

        const [rows] = await connection.execute<any[]>(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );

        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            user_id: row.user_id,
            email: row.email,
            role: row.role as Role,
            is_registered: row.is_registered
        };
    } catch (error) {
        return null;
    } finally {
        if (connection) connection.release();
    }
}
