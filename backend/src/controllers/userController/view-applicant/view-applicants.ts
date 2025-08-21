import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import pool from "../../../config/database-connection.js";
import { getApplicantsByEmployer } from "../../../service/get-applicants-by-employer-service.js";
import type { AuthenticatedUser } from "../../../types/express/auth.js";

type ApplicantsRequest = Request<{}, any, {}, { page?: string; pageSize?: string }> & {
  user?: AuthenticatedUser;
};

export const viewApplicants = async (req: ApplicantsRequest, res: Response): Promise<Response> => {
  let connection: PoolConnection | undefined;

  try {
    const employerUserId = req.user?.user_id;
    if (!employerUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;

    connection = await pool.getConnection();
    if (!connection) throw new Error("Failed to get database connection.");

    const result = await getApplicantsByEmployer(connection, employerUserId, { page, pageSize });

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching applicants:", error);
    return res.status(500).json({ message: "Failed to fetch applicants" });
  } finally {
    if (connection) connection.release();
  }
};
