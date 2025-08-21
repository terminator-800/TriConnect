import { getRoleConfig, type Role } from "./reject-user-helper.js";
import { deleteUserFilesAndFolders } from "./delete-folder.js";

import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import type { Request, Response } from "express";
import pool from "../../../config/database-connection.js";

interface RejectUserParams {
    user_id?: number;
}

interface RejectUserResult {
    success: boolean;
    message: string;
}

export const rejectUser = async (req: Request <RejectUserParams>, res: Response): Promise<void> => {
    const user_id: number | undefined = req.params.user_id;
    console.log("this is the user to be rejected: ", user_id);
    
    if (!user_id) {
        res.status(400).json({ message: "user_id parameter is required" });
        return;
    }

    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();
        const result = await rejectUsers(connection, user_id as number);

        res.json({ success: true, message: `User rejected successfully (${user_id}).` });
    } catch (error: any) {
        console.error("Error rejecting user:", error);
        res.status(500).json({ message: "Internal server error." });
    } finally {
        if (connection) connection.release();
    }
};

async function rejectUsers(connection: PoolConnection, user_id: number): Promise <RejectUserResult> {

    try {
        const [userRows] = await connection.execute <RowDataPacket[]> (
            `SELECT role FROM users WHERE user_id = ?`,
            [user_id]
        );

        if (!userRows.length) throw new Error("User not found.");

        const role: Role = userRows[0]!.role as Role;

        const { table, idField, resetFields, fileFields } = getRoleConfig(role);
        
        const [existingRows] = await connection.execute<RowDataPacket[]>(
            `SELECT ${resetFields.join(", ")} FROM ${table} WHERE ${idField} = ?`,
            [user_id]
        );

        const existingData: Record<string, any> = existingRows[0] || {};

        const displayName: string = 
        existingData.full_name || 
        existingData.business_name || 
        existingData.agency_name || "unknown";

        const fileList: string[] = 
        fileFields.map((field) => existingData[field]).filter(Boolean);

        await deleteUserFilesAndFolders(role, user_id, displayName, fileList);

        const resetQuery = `
      UPDATE ${table}
      SET ${resetFields.map((f) => `${f} = NULL`).join(", ")}
      WHERE ${idField} = ?
    `;
        await connection.execute(resetQuery, [user_id]);

        const userStatusQuery = `
      UPDATE users
      SET is_verified = false,
          is_submitted = false,
          is_rejected = true,
          verified_at = NULL
      WHERE user_id = ?
    `;
        await connection.execute(userStatusQuery, [user_id]);

        return {
            success: true,
            message: `${role} requirements rejected, files and folders removed, and rejection recorded.`,
        };
    } catch (error) {
        console.error("Error rejecting user:", error);
        throw error;
    }
}
