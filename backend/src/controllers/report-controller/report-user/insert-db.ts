import fs from "fs";
import path from "path";
import type { PoolConnection } from "mysql2/promise";

interface FileWithMulter extends Express.Multer.File { }

export async function moveFilesAndInsertToDB(
    files: FileWithMulter[],
    tempPath: string,
    finalPath: string,
    reportId: number,
    connection: PoolConnection
): Promise<void> {
    // Ensure final directory exists
    fs.mkdirSync(finalPath, { recursive: true });

    for (const file of files) {
        const oldPath = path.join(tempPath, file.filename);
        const newPath = path.join(finalPath, file.filename);

        try {
            // Move the file
            fs.renameSync(oldPath, newPath);

            const ext = path.extname(file.originalname).toLowerCase();
            let fileType: "image" | "pdf" | "file" = "file";

            if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
                fileType = "image";
            } else if (ext === ".pdf") {
                fileType = "pdf";
            } else {
                console.warn(`Skipping unsupported file type: ${ext}`);
                continue;
            }

            // Use forward slashes for DB paths
            const relativePath = path
                .join("reports", `${reportId}`, file.filename)
                .replace(/\\/g, "/");

            // Insert into DB
            await connection.query(
                `INSERT INTO report_proofs (report_id, file_url, file_type) VALUES (?, ?, ?)`,
                [reportId, relativePath, fileType]
            );
        } catch (error) {
            console.error(`Error processing file ${file.filename}:`, error);
            // optionally: continue to next file or throw to halt the operation
        }
    }
}
