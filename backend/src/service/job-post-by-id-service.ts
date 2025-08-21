import type { PoolConnection, RowDataPacket } from 'mysql2/promise';

export interface JobPost extends RowDataPacket {
  job_post_id: number;
  job_title: string;
  job_description: string;
  jobpost_status: string;
  created_at: Date;
  updated_at: Date;
  expires_at?: Date;
  // add any other fields in your job_post table
}

export const getJobPostById = async (
  connection: PoolConnection,
  jobPostId: number
): Promise<JobPost | null> => {
  try {
    const [rows] = await connection.query<JobPost[]>(
      `SELECT * FROM job_post WHERE job_post_id = ?`,
      [jobPostId]
    );

    return rows[0] || null;
  } catch (error) {
    console.error('❌ Error in getJobPostById:', error);
    throw error;
  }
};
