import { getTempPath, getFinalPath, deleteFolderIfExists } from "../report-user/helper.js";
import { moveFilesAndInsertToDB } from "./insert-db.js";
import { findExistingReport } from "./find-existing-report.js";
import { insertNewReport } from "./insert-new-report.js";
import type { AuthenticatedUser } from "../../../types/express/auth.js";
import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import pool from "../../../config/database-connection.js";

// Extend Express Request to include authenticated user info and optional Multer files
interface ReportUserRequest extends Request {
    user?: AuthenticatedUser;
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
    tempFolderId?: string;
}

interface ReportUserBody {
    reason: string;
    message?: string;
    reportedUserId: number;
    conversationId?: number;
}

export const reportUser = async (req: ReportUserRequest, res: Response) => {
    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const { reason, message, reportedUserId, conversationId } =
            req.body as ReportUserBody;

        const reportedBy = req.user?.user_id;

        // Flatten files from req.files
        const filesRaw = req.files;
        let files: Express.Multer.File[] = [];
        if (Array.isArray(filesRaw)) {
            files = filesRaw;
        } else if (filesRaw && typeof filesRaw === 'object') {
            files = Object.values(filesRaw).flat();
        }

        const tempFolderId = req.tempFolderId;

        if (!tempFolderId) {
            return res.status(400).json({ error: "Missing temporary folder ID." });
        }

        if (!reportedBy || !reportedUserId || !reason) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const tempPath = getTempPath(tempFolderId);

        const existing = await findExistingReport(
            connection,
            reportedBy,
            reportedUserId
        );

        if (existing.length > 0) {
            deleteFolderIfExists(tempPath);
            return res
                .status(409)
                .json({ error: "You have already reported this user." });
        }

        // Insert new report entry
        const reportId: number = await insertNewReport(
            connection,
            reportedBy,
            reportedUserId,
            reason,
            message,
            conversationId
        );

        const finalPath = getFinalPath(reportId);

        await moveFilesAndInsertToDB(files, tempPath, finalPath, reportId, connection);
        deleteFolderIfExists(tempPath);
        await connection.commit();

        res.status(200).json({ message: "Report submitted successfully." });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("❌ Report submission failed:", error);
        res.status(500).json({ error: "Failed to submit report." });
    } finally {
        if (connection) connection.release();
    }
};
