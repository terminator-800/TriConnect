import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import { getJobPostById } from "../../service/job-post-by-id-service.js";
import { ROLE } from "../../utils/roles.js";
import pool from "../../config/database-connection.js";
import logger from "../../config/logger.js";

interface ApproveJobPostParams {
    job_post_id?: string;
}

export const approveJobPost = async (req: Request<ApproveJobPostParams>, res: Response): Promise<void> => {

    if (req.user?.role !== ROLE.ADMINISTRATOR) {
        logger.warn(`Unauthorized attempt by user ID ${req.user?.user_id} to approve a job post.`);
        res.status(403).json({ error: "Forbidden: Admins only." });
        return;
    }

    const jobPostId = Number(req.params.job_post_id);
    if (isNaN(jobPostId)) {
        logger.warn(`Invalid job_post_id received: ${req.params.job_post_id}`);
        res.status(400).json({ message: "Invalid job_post_id" });
        return;
    }

    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();

        const result = await approveJobPostIfExists(connection, jobPostId);

        if (!result.success) {
            logger.info(`Job post not found: ID ${jobPostId}`);
            res.status(404).json({ message: result.message });
            return;
        }

        logger.info(`Job post approved successfully: ID ${jobPostId} by user ${req.user.user_id}`);
        res.status(200).json({ message: result.message });
    } catch (error: any) {
        logger.error("Error approving job post at (approve-job-post)", {
            user_id: req.user_id,
            ip: req.ip,
            message: error?.message || "Unknown error",
            stack: error?.stack || "No stack trace",
            name: error?.name || "UnknownError",
            cause: error?.cause || "No cause",
            error,
        });
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
        throw error;
    }
}
