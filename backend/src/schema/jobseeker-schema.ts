import type { Pool, PoolConnection } from 'mysql2/promise';
import logger from '../config/logger.js';

export async function createJobseekerTable(connection: Pool | PoolConnection) {
  const query = `
    CREATE TABLE IF NOT EXISTS jobseeker (
      jobseeker_id INT PRIMARY KEY,
      full_name VARCHAR(100),
      date_of_birth DATE,
      phone VARCHAR(20),
      gender ENUM('Male', 'Female', 'Other'),
      present_address VARCHAR(255),
      permanent_address VARCHAR(255),
      education TEXT,
      skills TEXT,
      government_id VARCHAR(255),
      selfie_with_id VARCHAR(255),
      nbi_barangay_clearance VARCHAR(255),
      FOREIGN KEY (jobseeker_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `;

  try {
    await connection.execute(query);
  } catch (error: unknown) {
    logger.error('Failed to create jobseeker table', { error });
    throw error; 
  }
}

