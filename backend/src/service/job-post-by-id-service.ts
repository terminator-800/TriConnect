import type { PoolConnection, RowDataPacket } from 'mysql2/promise';
import logger from '../config/logger.js';

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
  jobPostId: number,
  ip?: string
): Promise<JobPost | null> => {
  try {
    const [rows] = await connection.query<JobPost[]>(
      `SELECT * FROM job_post WHERE job_post_id = ?`,
      [jobPostId]
    );

    return rows[0] || null;
  } catch (error) {
    logger.error('Failed to fetch job post by ID', { jobPostId, ip, error });
    throw new Error('Failed to retrieve job post.');
  }
};
