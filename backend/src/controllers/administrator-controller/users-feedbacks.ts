import type { Response } from "express";
import pool from "../../config/database-connection.js";
import type { CustomRequest } from "../../types/express/auth.js"; 
import type { RowDataPacket } from "mysql2/promise";

interface UserFeedback extends RowDataPacket {
  feedback_id: number;
  user_id: number;
  role: string;
  message: string;
  submitted_at: string;
  user_name: string | null;
}

export const usersFeedbacks = async (req: CustomRequest, res: Response) => {
  let connection: Awaited<ReturnType<typeof pool.getConnection>> | undefined;

  try {
    if (req.user?.role !== "administrator") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    connection = await pool.getConnection();
    const feedbacks: UserFeedback[] = await getUserFeedbacks(connection);

    return res.status(200).json(feedbacks);

  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return res.status(500).json({ message: "Failed to fetch user feedback." });
  } finally {
    if (connection) connection.release();
  }
};

async function getUserFeedbacks(connection: Awaited<ReturnType<typeof pool.getConnection>>): Promise<UserFeedback[]> {
  const [rows] = await connection.query<RowDataPacket[]>(`
        SELECT
            feedback.feedback_id,
            feedback.user_id,
            feedback.role,
            feedback.message,
            DATE_FORMAT(feedback.created_at, '%M %e, %Y at %l:%i %p') AS submitted_at,
            CASE
                WHEN feedback.role = 'jobseeker' THEN jobseeker.full_name
                WHEN feedback.role = 'business-employer' THEN business_employer.business_name
                WHEN feedback.role = 'individual-employer' THEN individual_employer.full_name
                WHEN feedback.role = 'manpower-provider' THEN manpower_provider.agency_name 
                ELSE NULL
            END AS user_name
        FROM feedback feedback
        LEFT JOIN jobseeker jobseeker ON feedback.user_id = jobseeker.jobseeker_id
        LEFT JOIN business_employer business_employer ON feedback.user_id = business_employer.business_employer_id
        LEFT JOIN individual_employer individual_employer ON feedback.user_id = individual_employer.individual_employer_id
        LEFT JOIN manpower_provider manpower_provider ON feedback.user_id = manpower_provider.manpower_provider_id
        ORDER BY feedback.created_at DESC
    `);

  // cast rows to UserFeedback[]
  return rows as UserFeedback[];
}
