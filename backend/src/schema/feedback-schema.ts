import type { Pool, PoolConnection } from 'mysql2/promise';

export async function createFeedbackTable(connection: Pool | PoolConnection) {
  const query = `
    CREATE TABLE IF NOT EXISTS feedback (
      feedback_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      role ENUM('jobseeker', 'business-employer', 'individual-employer', 'manpower-provider') NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `;
  await connection.execute(query);
}

