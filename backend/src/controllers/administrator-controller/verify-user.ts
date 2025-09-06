import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { CustomRequest } from "../../types/express/auth.js";
import type { Response } from "express";
import pool from "../../config/database-connection.js";
import logger from "../../config/logger.js";

export const verifyUser = async (req: CustomRequest, res: Response) => {
    const user_id = req.params.user_id;

    if (!user_id) {
        logger.warn("verifyUser called without user_id", { ip: req.ip, user: req.user });
        return res.status(400).json({ message: "User ID is required." });
    }

    let connection: PoolConnection | undefined;

    // Only administrators can verify users
    if (req.user?.role !== "administrator") {
        logger.warn(`Unauthorized verify attempt by user ID ${req.user?.user_id}`);
        return res.status(403).json({ message: "Forbidden: Admins only." });
    }

    try {
        connection = await pool.getConnection();
        await verifyUsers(connection, user_id);
        res.json({ success: true, message: "User verified successfully." });
    } catch (error: any) {
        logger.error("Unexpected error in verifyUser endpoint", { error });
        res.status(500).json({ message: "Internal server error." });
    } finally {
        if (connection) {
            try {
                connection.release();
            } catch (releaseError) {
                logger.error("Failed to release DB connection", { error: releaseError });
            }
        }
    }
};

async function verifyUsers(connection: PoolConnection, user_id: string | number): Promise<{ success: true; user_id: string | number }> {
    try {
        const [userRows] = await connection.execute<RowDataPacket[]>(
            `SELECT user_id FROM users WHERE user_id = ?`,
            [user_id]
        );

        if (userRows.length === 0) {
            throw new Error("User not found.");
        }

        const [updateResult] = await connection.execute<ResultSetHeader>(
            `UPDATE users 
         SET is_verified = ?, is_rejected = ?, verified_at = NOW() 
         WHERE user_id = ?`,
            [true, false, user_id]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error("User verification failed.");
        }

        return { success: true, user_id };

    } catch (error) {
        logger.error("Error in verifyUsers function", { error });
        throw error;
    }
}
