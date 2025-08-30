import type { Request, Response } from "express";
import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import pool from "../../../config/database-connection.js";
import type { AuthenticatedUser } from "../../../types/express/auth.js";

// Make params optional
interface RejectApplicationParams {
  applicationId?: string;
}

// Request type with optional authenticated user
type RejectApplicationRequest = Request<
  RejectApplicationParams,
  any,
  any,
  any
> & {
  user?: AuthenticatedUser;
};

export const rejectApplication = async (
  req: RejectApplicationRequest,
  res: Response
): Promise<Response> => {
  let connection: PoolConnection | undefined;

  try {
    const employerUserId = req.user?.user_id;
    const applicationId = req.params.applicationId
      ? parseInt(req.params.applicationId, 10)
      : NaN;

    if (!employerUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Number.isFinite(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    connection = await pool.getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      `
      UPDATE job_applications ja
      JOIN job_post jp ON jp.job_post_id = ja.job_post_id
      SET ja.application_status = 'rejected'
      WHERE ja.application_id = ? AND jp.user_id = ?
      `,
      [applicationId, employerUserId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Application not found or not owned by employer" });
    }

    return res.status(200).json({ message: "Application rejected successfully" });
  } catch (error) {
    console.error("❌ Error rejecting application:", error);
    return res.status(500).json({ message: "Failed to reject application" });
  } finally {
    if (connection) connection.release();
  }
};
