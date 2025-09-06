import type { PoolConnection } from "mysql2/promise";
import logger from "../../../config/logger.js";

export async function insertJobApplication(
  connection: PoolConnection,
  job_post_id: number,
  applicant_id: number,
  role: string
): Promise<void> {
 try {
    await connection.execute(
      `INSERT INTO job_applications (job_post_id, applicant_id, role, applied_at)
       VALUES (?, ?, ?, NOW())`,
      [job_post_id, applicant_id, role]
    );
  } catch (error) {
     logger.error("Failed to insert job application", {
      error,
      job_post_id,
      applicant_id,
      role
    });
    throw error;
  }
}





