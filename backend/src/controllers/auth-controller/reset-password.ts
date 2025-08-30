import type { Request, Response, RequestHandler } from "express";
import { updateUserPassword } from "./update-password.js";
import type { JwtPayload } from "jsonwebtoken";
import pool from "../../config/database-connection.js";
import jwt from "jsonwebtoken";


interface ResetPasswordBody {
    token?: string;
    password?: string;
}

interface ResetTokenPayload extends JwtPayload {
    email: string;
}

export const resetPassword: RequestHandler = async (req: Request, res: Response) => {
    let connection: Awaited<ReturnType<typeof pool.getConnection>> | undefined;
    const { token, password } = req.body as ResetPasswordBody;

    if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required." });
    }

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as ResetTokenPayload;
        const { email } = decoded;

        await updateUserPassword(connection, email, password);
        await connection.commit();

        return res.status(200).json({ message: "Password has been reset successfully." });

    } catch (error: any) {
        if (connection) await connection.rollback();
        console.error("Reset password error:", error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Your reset link has expired. Please request a new one." });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid reset token. Please request a new one." });
        }

        return res.status(500).json({ message: "Server error" });
    } finally {
        if (connection) connection.release();
    }
};
