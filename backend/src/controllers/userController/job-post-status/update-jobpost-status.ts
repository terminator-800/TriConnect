import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from "express";
import type { AuthenticatedUser } from '../../../types/express/auth.js';
import type { PoolConnection } from "mysql2/promise";
import { updateStatus } from "./update-status.js";
import { ROLE } from '../../../utils/roles.js';
import logger from '../../../config/logger.js';
import pool from "../../../config/database-connection.js";

// Define route params type
interface UpdateJobPostStatusParams {
  jobPostId?: string; // comes from req.params
  status?: string;
}

// Allowed roles
const allowedRoles: typeof ROLE[keyof typeof ROLE][] = [
  ROLE.BUSINESS_EMPLOYER,
  ROLE.INDIVIDUAL_EMPLOYER,
  ROLE.MANPOWER_PROVIDER,
];

export const updateJobPostStatus = async (
  req: Request<UpdateJobPostStatusParams>,
  res: Response
) => {
  let connection: PoolConnection | undefined;
  const { jobPostId, status } = req.params;
  const role = (req.user as AuthenticatedUser)?.role;
  const user_id = (req.user as AuthenticatedUser)?.user_id;
  const ip = req.ip;

  if (!jobPostId || !status) {
    return res.status(400).json({ error: "Missing jobPostId or status" });
  }

  const allowedStatuses = ["paused", "active", "completed"];
  const normalizedStatus = status.toLowerCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ error: "Invalid job post status" });
  }

  const jobPostIdNum = Number(jobPostId);
  
  if (isNaN(jobPostIdNum)) {
    logger.warn("Invalid job post ID", { jobPostId, user_id, role, ip });
    return res.status(400).json({ error: "Invalid job post ID" });
  }

  if (!allowedRoles.includes(role)) {
    logger.warn("Unauthorized role tried to update job post status", { role, user_id, jobPostIdNum, ip });
    return res.status(403).json({ error: "Forbidden: Only authorized employers can delete job posts." });
  }

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const result = await updateStatus(
      connection,
      normalizedStatus,
      jobPostIdNum
    );

    if (!result) {
      await connection.rollback();
      logger.error("Failed to update job post status", { jobPostIdNum, user_id, role, ip });
      return res.status(500).json({ error: "Failed to update job post status" });
    }

    if (result.affectedRows === 0) {
      await connection.rollback();
      logger.warn("Job post not found", { jobPostIdNum, user_id, role, ip });
      return res.status(404).json({ error: "Job post not found" });
    }

    await connection.commit();
    return res.status(200).json({ message: "Job post status updated successfully" });
  } catch (error) {

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        logger.error("Failed to rollback transaction", { rollbackError, jobPostIdNum, user_id, role, ip });
      }
    }

    logger.error("Unexpected error updating job post status", { error, jobPostIdNum, user_id, role, ip });
    return res.status(500).json({ error: "Failed to update status" });

  } finally {

    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        logger.error("Failed to release database connection", { releaseError, user_id, jobPostIdNum, role, ip });
      }
    }

  }
};
