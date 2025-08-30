import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import { getJobPostById } from "../../service/job-post-by-id-service.js";
import pool from "../../config/database-connection.js";

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

  if (!jobPostId) {
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
    console.error("Error rejecting jobpost:", error);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) connection.release();
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
    console.error("Error in rejectJobPostIfExists:", error);
    throw error;
  }
}
