import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from "express";
import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import pool from "../../../config/database-connection.js";
import { updateStatus } from "./update-status.js";

// Define route params type
interface UpdateJobPostStatusParams {
  jobPostId?: string; // comes from req.params
  status?: string;
}

export const updateJobPostStatus = async (
  req: Request<UpdateJobPostStatusParams>,
  res: Response
) => {
  let connection: PoolConnection | undefined;
  const { jobPostId, status } = req.params;

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
    return res.status(400).json({ error: "Invalid job post ID" });
  }

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const result: ResultSetHeader = await updateStatus(
      connection,
      normalizedStatus,
      jobPostIdNum
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Job post not found" });
    }

    await connection.commit();
    return res.status(200).json({ message: "Job post status updated successfully" });
  } catch (error) {
    console.error("Error updating job post status:", error);
    return res.status(500).json({ error: "Failed to update status" });
  } finally {
    if (connection) connection.release();
  }
};
