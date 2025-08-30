import type { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export interface ProofFile extends RowDataPacket {
    file_url: string;
}

/** Fetch all proof file paths for a given report */
export async function fetchProofFiles(
    connection: PoolConnection,
    reportId: number
): Promise<ProofFile[]> {
    const [proofs] = await connection.query<ProofFile[]>(
        `SELECT file_url 
     FROM report_proofs 
     WHERE report_id = ?`,
        [reportId]
    );
    return proofs;
}

/** Delete all proof records for a report */
export async function deleteProofRecords(
    connection: PoolConnection,
    reportId: number
): Promise<void> {
    await connection.query<ResultSetHeader>(
        `DELETE FROM report_proofs WHERE report_id = ?`,
        [reportId]
    );
}

/** Delete the report record itself */
export async function deleteReportRecord(
    connection: PoolConnection,
    reportId: number
): Promise<boolean> {
    const [result] = await connection.query<ResultSetHeader>(
        `DELETE FROM reports WHERE report_id = ?`,
        [reportId]
    );
    return result.affectedRows > 0;
}

/** Delete proof files from disk */
export function deleteFiles(proofs: ProofFile[]): void {
    proofs.forEach(({ file_url }) => {
        const relativePath = file_url.replace(/^\/+/, "");
        const filePath = path.join(__dirname, "../../../../", "uploads", relativePath);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${file_url}`, err);
            } else {
                console.log(`Deleted file: ${file_url}`);
            }
        });
    });
}

/** Delete the report folder (uploads/reports/<report_id>) */
export function deleteReportFolder(reportId: number | string): void {
    const folderPath = path.join(__dirname, "../../../../", "uploads", "reports", String(reportId));
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error(`Failed to delete folder: ${folderPath}`, err);
        } else {
            console.log(`Deleted folder: ${folderPath}`);
        }
    });
}
