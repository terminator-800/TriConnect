import type { PoolConnection, RowDataPacket } from "mysql2/promise";

export async function getUserInfo(connection: PoolConnection, user_id: number) {
    try {
        const [rows] = await connection.execute <RowDataPacket[]> (
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error fetching user info by ID:", error);
        return null;
    }
}
