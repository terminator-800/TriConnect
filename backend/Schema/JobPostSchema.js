async function createJobPostTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS job_post (
      job_post_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL, -- Foreign key to reference the user
      role ENUM('business_employer', 'individual_employer', 'manpower_provider') NOT NULL,
      status ENUM('pending', 'approved', 'rejected', 'draft') DEFAULT NULL,
      jobpost_status ENUM('active', 'paused', 'completed', 'archive', 'deleted') DEFAULT NULL,
      submitted_at DATETIME DEFAULT NULL,
      approved_at DATETIME DEFAULT NULL,
      expires_at DATETIME DEFAULT NULL,
      rejection_reason TEXT DEFAULT NULL,
      is_verified_jobpost BOOLEAN DEFAULT FALSE,
      job_title VARCHAR(255) NOT NULL,
      job_type ENUM('Full-time', 'Part-time', 'Contract') NOT NULL,
      salary_range INT,
      location VARCHAR(255),
      required_skill TEXT,
      job_description TEXT,
      applicant_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE 
    );
  `;
  await connection.execute(query);
}


module.exports = { createJobPostTable };