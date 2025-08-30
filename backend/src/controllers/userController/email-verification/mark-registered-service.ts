import type { PoolConnection } from "mysql2/promise";

export async function markRegistered(connection: PoolConnection, email: string): Promise <void> {
    try {
        await connection.execute(
            "UPDATE users SET is_registered = ? WHERE email = ?",
            [1, email]
        );
    } catch (error: unknown) {
        console.error("Error marking user as registered:", (error as Error).message);
        throw error;
    }
}
