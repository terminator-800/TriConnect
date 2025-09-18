import { addMonths } from "date-fns";
import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import logger from "../../../config/logger.js";

/**
 * Soft-delete a job post by updating its status and expiration date.
 * @param connection - MySQL PoolConnection
 * @param jobPostId - ID of the job post to delete
 * @returns ResultSetHeader containing affectedRows, insertId, etc.
 */
export const deleteJobPost = async (
  connection: PoolConnection,
  jobPostId: number
): Promise<ResultSetHeader> => {
  const expiresAt = addMonths(new Date(), 1);

  const softDeleteQuery = `
    UPDATE job_post
    SET jobpost_status = ?, expires_at = ?
    WHERE job_post_id = ?
  `;

  try {
    const [result] = await connection.query<ResultSetHeader>(
      softDeleteQuery,
      ['deleted', expiresAt, jobPostId]
    );

    return result;
  } catch (error) {
    throw new Error("Database error while soft-deleting job post");
  }
};
