import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import { getJobPostById } from "../../service/job-post-by-id-service.js";
import pool from "../../config/database-connection.js";
import logger from "../../config/logger.js";

interface RejectJobPostParams {
  job_post_id?: string | number;
}

interface RejectJobPostResult {
  success: boolean;
  message: string;
}

export const rejectJobPost = async (
  req: Request<RejectJobPostParams>,
  res: Response
): Promise<void> => {
  const jobPostId = req.params.job_post_id;

  if (req.user?.role !== "administrator") {
    logger.warn(`Unauthorized attempt by user ID ${req.user?.user_id} to reject a job post.`);
    res.status(403).json({ error: "Forbidden: Admins only." });
    return;
  }

  if (!jobPostId) {
    logger.warn(`Missing job_post_id in request by user ${req.user?.user_id}`);
    res.status(400).json({ error: "job_post_id parameter is required" });
    return;
  }

  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    const result = await rejectJobPostIfExists(connection, jobPostId);

    if (!result.success) {
      res.status(404).json({ error: result.message });
      return;
    }

    res.status(200).json({ message: result.message });
  } catch (error: any) {
    logger.error("Unexpected error in rejectJobPost endpoint", { error: error, userId: req.user?.user_id, jobPostId });
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        logger.error("Failed to release DB connection", { error: releaseError, userId: req.user?.user_id, jobPostId });
      }
    }
  }
};

async function rejectJobPostIfExists(
  connection: PoolConnection,
  jobPostId: string | number
): Promise<RejectJobPostResult> {
  try {
    const jobPost = await getJobPostById(connection, Number(jobPostId));
    
    if (!jobPost) {
      return { success: false, message: "Jobpost not found." };
    }

    await connection.query(
      `UPDATE job_post 
       SET 
         status = 'rejected', 
         is_verified_jobpost = FALSE
       WHERE job_post_id = ?`,
      [Number(jobPostId)]
    );

    return { success: true, message: "Jobpost rejected successfully." };
  } catch (error) {
    logger.error("Error rejecting job post in rejectJobPostIfExists", { error, jobPostId });
    throw error;
  }
}
