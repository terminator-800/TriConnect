import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import { getJobPostById } from "../../service/job-post-by-id-service.js";
import pool from "../../config/database-connection.js";

interface ApproveJobPostParams {
    job_post_id?: string; 
}

export const approveJobPost = async (req: Request<ApproveJobPostParams>, res: Response): Promise<void> => {
    const jobPostId = Number(req.params.job_post_id); 
    if (isNaN(jobPostId)) {
        res.status(400).json({ message: "Invalid job_post_id" });
        return;
    }

    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();

        const result = await approveJobPostIfExists(connection, jobPostId);

        if (!result.success) {
            res.status(404).json({ message: result.message });
            return;
        }

        res.status(200).json({ message: result.message });
    } catch (error: any) {
        console.error("Error approving jobpost:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        if (connection) connection.release();
    }
};

interface ApproveJobPostResult {
    success: boolean;
    message: string;
}

async function approveJobPostIfExists(connection: PoolConnection, jobPostId: number): Promise<ApproveJobPostResult> {
    try {
        const jobPost = await getJobPostById(connection, jobPostId);

        if (!jobPost) {
            return { success: false, message: 'Jobpost not found.' };
        }

        await connection.query(
            `UPDATE job_post
             SET 
                 status = 'approved',
                 jobpost_status = 'active',
                 rejection_reason = NULL,
                 approved_at = NOW(),
                 is_verified_jobpost = TRUE
             WHERE job_post_id = ?`,
            [jobPostId]
        );

        return { success: true, message: 'Jobpost approved successfully.' };
    } catch (error) {
        console.error("Error in approveJobPostIfExists:", error);
        throw error;
    }
}
