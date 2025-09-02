import { type Role } from "./reject-user-helper.js";
import fs from "fs/promises";
import path from "path";

// Base uploads folder
const UPLOADS_BASE = path.join(
    "C:", "Users", "denne", "OneDrive", "Desktop", "TriConnect-1.2", "backend", "uploads"
);

/**
 * Deletes physical files and user folders
 * @param role Role of the user
 * @param userId user_id from DB
 * @param name display name (optional)
 * @param files Array of full relative file paths (from DB)
 */
export async function deleteUserFilesAndFolders(
    role: Role,
    userId: number,
    name: string | undefined,
    files: (string | undefined)[]
): Promise<void> {


    // Delete each file using its full relative path
    for (const file of files) {
        if (!file) continue;

        const fullPath = path.join(UPLOADS_BASE, file.replace(/^uploads[\\/]/, ""));
        try {
            await fs.unlink(fullPath);
        } catch (err: any) {

        }
    }

    // Delete the displayName subfolder if provided
    if (name) {
        const safeName = name.replace(/[^a-zA-Z0-9 _.-]/g, "").trim();
        const folderPath = path.join(UPLOADS_BASE, role, userId.toString(), safeName);

        try {
            await fs.rm(folderPath, { recursive: true, force: true });
        } catch (err: any) {

        }
    }

    // Remove the parent user folder only if empty
    const userFolderPath = path.join(UPLOADS_BASE, role, userId.toString());
    try {
        const remaining = await fs.readdir(userFolderPath);
        if (remaining.length === 0) {
            await fs.rm(userFolderPath, { recursive: true, force: true });
        }
    } catch (err: any) {

    }
}
