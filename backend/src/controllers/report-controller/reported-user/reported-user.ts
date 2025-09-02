import type { Request, Response } from "express";
import type { AuthenticatedUser } from "../../../types/express/auth.js";
import { getReportedUsersById } from "./get-reported-ids.js";
import type { PoolConnection } from "mysql2/promise";
import pool from "../../../config/database-connection.js";

interface ReportedUsersRequest extends Request {
    user?: AuthenticatedUser;
}

interface ReportedUser {
    report_id: number;
    reported_user_id: number;
    reported_by: number;
    reason: string;
    message?: string;
    conversation_id?: number;
    created_at: string;
}

export const reportedUsers = async (req: ReportedUsersRequest, res: Response) => {
    let connection: PoolConnection | undefined;
    const reportedBy = req.user?.user_id;

    if (!reportedBy) {
        return res.status(400).json({ error: "User ID missing in token." });
    }

    try {
        connection = await pool.getConnection();

        const reportedUsersList: ReportedUser[] = await getReportedUsersById(connection, reportedBy);

        return res.status(200).json(reportedUsersList);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch reported users." });
    } finally {
        if (connection) connection.release();
    }
};
