import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { deleteUserFilesAndFolders } from "./delete-folder.js";
import { getRoleConfig, type Role } from "./reject-user-helper.js";
import type { Request, Response } from "express";
import { extractPublicIdFromUrl } from "./reject-user-helper.js"
import { deleteFromCloudinary } from "../../../utils/delete-from-cloudinary.js";
import pool from "../../../config/database-connection.js";
import logger from "../../../config/logger.js";

interface RejectUserParams {
    user_id?: number;
}

interface RejectUserResult {
    success: boolean;
    message: string;
}

export const rejectUser = async (req: Request<RejectUserParams>, res: Response): Promise<void> => {
    const user_id: number | undefined = req.params.user_id;

    if (!user_id) {
        logger.warn("Reject user called without user_id parameter");
        res.status(400).json({ message: "user_id parameter is required" });
        return;
    }

    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();
        const result = await rejectUsers(connection, user_id as number);

        logger.info(`User ${user_id} rejected successfully`);
        res.json({ success: true, message: result.message });
    } catch (error: any) {
        logger.error(`Failed to reject: (User ID: ${user_id})`, { error });
        res.status(500).json({ message: "Internal server error." });
    } finally {
        if (connection) {
            try {
                connection.release();
                logger.debug(`Database connection released for user ${user_id}`);
            } catch (releaseError: any) {
                logger.error(`Failed to release database connection for user ${user_id}`, { releaseError });
            }
        }
    }
};

async function rejectUsers(connection: PoolConnection, user_id: number): Promise<RejectUserResult> {

    try {
        const [userRows] = await connection.execute<RowDataPacket[]>(
            `SELECT role FROM users WHERE user_id = ?`,
            [user_id]
        );

        if (!userRows.length) {
            logger.warn(`User ${user_id} not found in database`);
            throw new Error("User not found.");
        }

        const role: Role = userRows[0]!.role as Role;

        const { table, idField, resetFields, fileFields } = getRoleConfig(role);

        const [existingRows] = await connection.execute<RowDataPacket[]>(
            `SELECT ${resetFields.join(", ")} FROM ${table} WHERE ${idField} = ?`,
            [user_id]
        );

        const existingData: Record<string, any> = existingRows[0] || {};

        const displayName: string = existingData.full_name || existingData.business_name || existingData.agency_name || "unknown";

        // --- Delete files from Cloudinary ---
        for (const field of fileFields) {
            const fileUrl = existingData[field];
            const publicId = extractPublicIdFromUrl(fileUrl);
            if (publicId) {
                try {
                    await deleteFromCloudinary(publicId);
                    logger.info(`Deleted ${field} for user ${user_id} from Cloudinary`, { publicId });
                } catch (cloudError: any) {
                    logger.error(`Failed to delete ${field} from Cloudinary for user ${user_id}`, { cloudError });
                }
            }
        }

        const fileList: string[] =
            fileFields.map((field) => existingData[field]).filter(Boolean);

        // --- Delete local files and folders ---
        try {
            await deleteUserFilesAndFolders(role, user_id, displayName, fileList);
            logger.info(`Deleted local files and folders for user ${user_id}`, { role, files: fileList });
        } catch (fileError: any) {
            logger.error(`Failed to delete local files/folders for user ${user_id}`, { fileError });
        }

        // --- Reset fields in the specific role table ---
        try {
            const resetQuery = `
                UPDATE ${table}
                SET ${resetFields.map((f) => `${f} = NULL`).join(", ")}
                WHERE ${idField} = ?
            `;
            await connection.execute(resetQuery, [user_id]);
            logger.debug(`Reset fields for user ${user_id} in ${table}`, { resetFields });
        } catch (resetError: any) {
            logger.error(`Failed to reset fields for user ${user_id} in ${table}`, { resetError });
            throw resetError;
        }

        // --- Update user status ---
        try {
            const userStatusQuery = `
                UPDATE users
                SET is_verified = false,
                    is_submitted = false,
                    is_rejected = true,
                    verified_at = NULL
                WHERE user_id = ?
            `;
            await connection.execute(userStatusQuery, [user_id]);
            logger.debug(`Updated rejection status for user ${user_id}`);
        } catch (statusError: any) {
            logger.error(`Failed to update rejection status for user ${user_id}`, { statusError });
            throw statusError;
        }

        return {
            success: true,
            message: `${role} requirements rejected, files and folders removed, and rejection recorded.`,
        };
    } catch (error) {
        logger.error(`Error in (rejectUsers) for user ${user_id}`, { error });
        throw error;
    }
}
