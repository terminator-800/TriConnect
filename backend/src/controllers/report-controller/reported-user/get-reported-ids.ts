import type { PoolConnection, RowDataPacket } from "mysql2/promise";

// Define ReportedUser here
export interface ReportedUser {
    report_id: number;
    reported_user_id: number;
    reported_by: number;
    reason: string;
    message?: string;
    conversation_id?: number;
    created_at: string;
}

export async function getReportedUsersById(
    connection: PoolConnection,
    reportedBy: number
): Promise<ReportedUser[]> {
    const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT * FROM reports WHERE reported_by = ?`,
        [reportedBy]
    );
    return rows as ReportedUser[];
}
