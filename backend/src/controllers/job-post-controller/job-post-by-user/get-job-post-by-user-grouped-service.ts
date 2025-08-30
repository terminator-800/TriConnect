import { format } from "date-fns";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";

export type UserRole = "jobseeker" | "individual-employer" | "business-employer" | "manpower-provider";
export type JobCategory = "pending" | "active" | "completed";

export interface UserStatus {
  is_verified: boolean;
  is_rejected: boolean;
  is_submitted: boolean;
}

export interface JobPostRow extends RowDataPacket {
  job_post_id: number;
  user_id: number;
  job_title: string;
  job_description: string;
  location: string;
  salary_range: string | null;
  status: string;
  created_at: string | Date;
  job_type: string | null;
  jobpost_status: string | null;
  role: UserRole;
  employer_name: string | null;
  authorized_person: string | null;
  applicant_count: number;
  category: JobCategory | null;
}

export interface GroupedJobPosts {
  pending: JobPostRow[];
  active: JobPostRow[];
  completed: JobPostRow[];
}

export interface JobPostsByUser extends UserStatus, GroupedJobPosts { }

export async function getJobPostsByUserGrouped(
  connection: PoolConnection,
  user_id: number
): Promise<JobPostsByUser> {
  try {
    // Fetch user verification status
    const [[userStatus]] = await connection.query<RowDataPacket[] & UserStatus[]>(
      `SELECT is_verified, is_rejected, is_submitted FROM users WHERE user_id = ?`,
      [user_id]
    );

    // Fetch grouped job posts
    const [rows] = await connection.query<RowDataPacket[] & JobPostRow[]>(
      `
      SELECT 
        jp.job_post_id,
        jp.user_id,
        jp.job_title,
        jp.job_description,
        jp.location,
        jp.salary_range,
        jp.status,
        jp.created_at,
        jp.job_type,
        jp.jobpost_status,
        u.role,
        CASE 
          WHEN u.role = 'business-employer' THEN be.business_name
          WHEN u.role = 'manpower-provider' THEN mp.agency_name
          WHEN u.role = 'individual-employer' THEN ie.full_name
          ELSE NULL
        END AS employer_name,
        CASE 
          WHEN u.role = 'business-employer' THEN be.authorized_person
          WHEN u.role = 'manpower-provider' THEN mp.agency_authorized_person
          WHEN u.role = 'individual-employer' THEN ie.full_name
          ELSE NULL
        END AS authorized_person,
        COUNT(CASE WHEN ja.application_status != 'rejected' THEN 1 END) AS applicant_count,
        CASE
          WHEN jp.status = 'pending' AND (jp.jobpost_status != 'deleted' OR jp.jobpost_status IS NULL)
            THEN 'pending'
          WHEN jp.status = 'approved' AND jp.jobpost_status IN ('active', 'paused')
            THEN 'active'
          WHEN jp.status = 'approved' AND jp.jobpost_status = 'completed'
            THEN 'completed'
          ELSE NULL
        END AS category
      FROM job_post jp
      JOIN users u ON jp.user_id = u.user_id
      LEFT JOIN business_employer be ON u.user_id = be.business_employer_id
      LEFT JOIN manpower_provider mp ON u.user_id = mp.manpower_provider_id
      LEFT JOIN individual_employer ie ON u.user_id = ie.individual_employer_id
      LEFT JOIN job_applications ja ON jp.job_post_id = ja.job_post_id
      WHERE jp.user_id = ?
        AND (jp.jobpost_status != 'deleted' OR jp.jobpost_status IS NULL)
        AND (
          (jp.status = 'pending') OR
          (jp.status = 'approved' AND jp.jobpost_status IN ('active', 'paused', 'completed'))
        )
      GROUP BY jp.job_post_id
      ORDER BY jp.created_at DESC
      `,
      [user_id]
    );

    const grouped: GroupedJobPosts = { pending: [], active: [], completed: [] };

    for (const row of rows) {
      if (row.created_at) {
        row.created_at = format(new Date(row.created_at), "MMMM d, yyyy 'at' h:mm a");
      }
      if (row.category) {
        grouped[row.category].push(row);
      }
    }

    return {
      is_verified: !!userStatus?.is_verified,
      is_rejected: !!userStatus?.is_rejected,
      is_submitted: !!userStatus?.is_submitted,
      ...grouped,
    };
  } catch (error) {
    console.error("❌ Error fetching job posts by user:", error);
    throw error;
  }
}
