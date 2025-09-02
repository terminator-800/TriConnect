import type { CustomRequest, AuthenticatedUser, Role } from "../../types/express/auth.js";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { findUsersEmail } from "../../service/find-user-email-service.js";
import type { Response } from "express";
import bcrypt from "bcrypt";
import pool from "../../config/database-connection.js";
import jwt from "jsonwebtoken";

interface UserRow extends RowDataPacket {
    user_id: number;
    email: string;
    password: string;
    role: Role;
    is_registered: number;
}

export const login = async (request: CustomRequest, response: Response) => {
    let connection: PoolConnection | undefined;
    const { email, password } = request.body as { email: string; password: string };

    try {
        connection = await pool.getConnection();

        const user: UserRow | null = await findUsersEmail(connection, email);

        if (!user) {
            return response.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.is_registered) {
            return response.status(403).json({ message: "Please verify your email first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return response.status(401).json({ message: "Invalid email or password" });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role,
                is_registered: user.is_registered,
            } as AuthenticatedUser,
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        const isProduction = process.env.NODE_ENV === "production";

        // Set cookie
        response.cookie("token", token, {
            httpOnly: true,
            secure: isProduction, // only true in prod
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return response.status(200).json({
            message: "Login successful",
            role: user.role,
            user_id: user.user_id,
            token
        });
    } catch (error) {
        response.status(500).json({ message: "Server error" });
    } finally {
        if (connection) connection.release();
    }
};
