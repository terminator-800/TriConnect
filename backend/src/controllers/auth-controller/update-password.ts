import type { PoolConnection, ResultSetHeader } from "mysql2/promise";

export const updateUserPassword = async (
    connection: PoolConnection,
    email: string,
    password: string
): Promise<ResultSetHeader> => {
    try {
        const [result] = await connection.execute<ResultSetHeader>(
            "UPDATE users SET password = ? WHERE email = ?",
            [password, email]
        );

        return result;
    } catch (error: any) {
        throw error;
    }
};
