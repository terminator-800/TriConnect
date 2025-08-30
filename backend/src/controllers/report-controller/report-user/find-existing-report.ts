import type { PoolConnection, RowDataPacket } from "mysql2/promise";

export async function findExistingReport(
    connection: PoolConnection,
    reportedBy: number,
    reportedUserId: number
): Promise<RowDataPacket[]> {
    const [existing] = await connection.query<RowDataPacket[]>(
        `SELECT 1 FROM reports WHERE reported_by = ? AND reported_user_id = ?`,
        [reportedBy, reportedUserId]
    );

    return existing;
}
