import type { PoolConnection, ResultSetHeader } from "mysql2/promise";

export async function insertNewReport(
    connection: PoolConnection,
    reportedBy: number,
    reportedUserId: number,
    reason: string,
    message?: string,
    conversationId?: number
): Promise<number> {
    const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO reports (reported_by, reported_user_id, reason, message, conversation_id)
     VALUES (?, ?, ?, ?, ?)`,
        [reportedBy, reportedUserId, reason, message ?? null, conversationId ?? null]
    );

    return result.insertId;
}
