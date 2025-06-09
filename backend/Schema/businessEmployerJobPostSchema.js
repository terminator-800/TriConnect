async function createJobPostTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS business_job_post (
      job_post_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL, -- Foreign key to reference the user
      role VARCHAR(50) DEFAULT NULL,
      job_title VARCHAR(255) NOT NULL,
      job_type ENUM('full-time', 'part-time', 'contract') NOT NULL,
      salary_range VARCHAR(50),
      location VARCHAR(255),
      required_skill TEXT,
      job_description TEXT,
      is_verified_jobpost BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE -- Assuming a 'users' table exists
    );
  `;
  await connection.execute(query);
}

module.exports = { createJobPostTable };