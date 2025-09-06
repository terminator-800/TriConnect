import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import logger from "../../../config/logger.js";

export async function getUserInfo(connection: PoolConnection, user_id: number) {
    try {

        if (!connection) {
            throw new Error("Database connection is undefined");
        }

        if (!Number.isFinite(user_id)) {
            throw new Error(`Invalid user_id: ${user_id}`);
        }

        const [rows] = await connection.execute<RowDataPacket[]>(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        logger.error("Failed to fetch user info", { error, user_id });
        return null;
    }
}
