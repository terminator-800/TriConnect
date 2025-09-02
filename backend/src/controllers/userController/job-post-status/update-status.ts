import type { PoolConnection, ResultSetHeader } from "mysql2/promise";

/**
 * Update the status of a job post
 * @param connection - MySQL PoolConnection
 * @param status - New status string
 * @param jobPostId - ID of the job post to update
 * @returns ResultSetHeader containing affectedRows, etc.
 */
export const updateStatus = async (
    connection: PoolConnection,
    status: string,
    jobPostId: number
): Promise<ResultSetHeader | null> => {
    try {
        const [result] = await connection.query<ResultSetHeader>(
            "UPDATE job_post SET jobpost_status = ? WHERE job_post_id = ?",
            [status, jobPostId]
        );
        return result;
    } catch (error) {
        return null;
    }
};
