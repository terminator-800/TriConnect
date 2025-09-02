import type { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export interface ProofFile extends RowDataPacket {
    file_url: string;
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
    try{
        const [result] = await connection.query<ResultSetHeader>(
            `DELETE FROM reports WHERE report_id = ?`,
            [reportId]
        );
        return result.affectedRows > 0;
    }catch (error){
        throw error
    }
}

