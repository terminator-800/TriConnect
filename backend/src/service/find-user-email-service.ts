import type { PoolConnection } from "mysql2/promise";
import type { User } from "../interface/interface.js";

export async function findUsersEmail(
    connection: PoolConnection,
    email: string
): Promise<User | null> {
    try {
        const [rows] = await connection.execute<User[]>(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return rows.length > 0 && rows[0] ? rows[0] : null;
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw error; 
    }
}

