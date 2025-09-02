import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { CustomRequest } from "../../types/express/auth.js";
import type { Response } from "express";
import pool from "../../config/database-connection.js";

export const verifyUser = async (req: CustomRequest, res: Response) => {
    const user_id = req.params.user_id;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required." });
    }

    let connection: PoolConnection | undefined;

    // Only administrators can verify users
    if (req.user?.role !== "administrator") {
        return res.status(403).json({ message: "Forbidden: Admins only." });
    }

    try {
        connection = await pool.getConnection();
        await verifyUsers(connection, user_id);
        res.json({ success: true, message: "User verified successfully." });
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error." });
    } finally {
        if (connection) connection.release();
    }
};

async function verifyUsers(connection: PoolConnection, user_id: string | number): Promise<{ success: true; user_id: string | number }> {
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
}
