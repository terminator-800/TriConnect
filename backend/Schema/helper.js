async function createUsersTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      role ENUM('jobseeker', 'business-employer', 'individual-employer', 'manpower-provider', 'administrator') NOT NULL,
      is_registered BOOLEAN DEFAULT FALSE,
      is_verified BOOLEAN DEFAULT FALSE,
      is_submitted BOOLEAN DEFAULT FALSE,
      is_rejected BOOLEAN DEFAULT FALSE,
      verified_at DATETIME NULL DEFAULT NULL,
      is_subscribed BOOLEAN DEFAULT FALSE,
      subscription_start DATE DEFAULT NULL, 
      subscription_end DATE DEFAULT NULL,  
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,

      -- Token to manage single active session
      current_token VARCHAR(255) DEFAULT NULL,

      -- Account status fields
      account_status ENUM('active', 'restricted', 'blocked', 'suspended', 'banned') DEFAULT 'active',
      status_reason TEXT,
      status_updated_at DATETIME DEFAULT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await connection.execute(query);
}

async function createJobseekerTable(connection) {
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
  await connection.execute(query);
}

async function createBusinessEmployerTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS business_employer (
      business_employer_id INT PRIMARY KEY,
      business_name VARCHAR(100),
      business_address VARCHAR(255),
      industry VARCHAR(100),
      business_size VARCHAR(50),
      authorized_person VARCHAR(100),
      authorized_person_id VARCHAR(255),
      business_permit_BIR VARCHAR(255),
      DTI VARCHAR(255),
      business_establishment VARCHAR(255),
      FOREIGN KEY (business_employer_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `;
  await connection.execute(query);
}

async function createIndividualEmployerTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS individual_employer (
      individual_employer_id INT PRIMARY KEY,
      full_name VARCHAR(100),
      date_of_birth DATE,
      phone VARCHAR(20),
      gender ENUM('Male', 'Female', 'Other'),
      present_address VARCHAR(255),
      permanent_address VARCHAR(255),
      government_id VARCHAR(255),
      selfie_with_id VARCHAR(255),
      nbi_barangay_clearance VARCHAR(255),
      FOREIGN KEY (individual_employer_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `;
  await connection.execute(query);
}

async function createManpowerProviderTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS manpower_provider (
      manpower_provider_id INT PRIMARY KEY,
      agency_name VARCHAR(100),
      agency_address VARCHAR(255),
      agency_services TEXT,
      agency_authorized_person VARCHAR(100),
      dole_registration_number VARCHAR(255),
      mayors_permit VARCHAR(255),
      agency_certificate VARCHAR(255),
      authorized_person_id VARCHAR(255),
      FOREIGN KEY (manpower_provider_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `;
  await connection.execute(query);
}

async function createJobPostTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS job_post (
      job_post_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL, -- Foreign key to reference the user
      role ENUM('business-employer', 'individual-employer', 'manpower-provider') NOT NULL,
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

async function createJobApplicationsTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS job_applications (
      application_id INT AUTO_INCREMENT PRIMARY KEY,
      job_post_id INT NOT NULL, -- Foreign key to the job post
      applicant_id INT NOT NULL, -- Foreign key to the user applying
      role ENUM('jobseeker', 'manpower-provider') NOT NULL,
      application_status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_post_id) REFERENCES job_post(job_post_id) ON DELETE CASCADE,
      FOREIGN KEY (applicant_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `;
  await connection.execute(query);
}

async function conversations(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS conversations (
      conversation_id INT AUTO_INCREMENT PRIMARY KEY,
      user1_id INT NOT NULL,
      user2_id INT NOT NULL,
      user_small_id INT NOT NULL,
      user_large_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_pair (user_small_id, user_large_id)
    );
  `;
  await connection.execute(query);
}

async function messages(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      message_id INT AUTO_INCREMENT PRIMARY KEY,
      conversation_id INT NOT NULL,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      read_at DATETIME NULL,
      is_read BOOLEAN DEFAULT FALSE,
      message_text TEXT,
      message_type ENUM('text', 'image', 'file') DEFAULT 'text',
      file_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
      INDEX idx_conversation_id (conversation_id),
      INDEX idx_receiver_id (receiver_id)
    );
  `;
  await connection.execute(query);
}


async function createReportsTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS reports (
      report_id INT AUTO_INCREMENT PRIMARY KEY,
      reported_by INT NOT NULL,
      reported_user_id INT NOT NULL,
      reason TEXT NOT NULL,
      message TEXT,
      conversation_id INT, -- nullable: if report is about a chat
      job_post_id INT,     -- nullable: if report is about a job post
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',

      -- 🔐 Prevent duplicate reports from the same user
      UNIQUE (reported_by, reported_user_id),

      FOREIGN KEY (reported_by) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (reported_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL,
      FOREIGN KEY (job_post_id) REFERENCES job_post(job_post_id) ON DELETE SET NULL,

      INDEX idx_reported_by (reported_by),
      INDEX idx_reported_user_id (reported_user_id),
      INDEX idx_conversation_id (conversation_id),
      INDEX idx_job_post_id (job_post_id)
    );
  `;
  await connection.execute(query);
}

async function createReportProofsTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS report_proofs (
      proof_id INT AUTO_INCREMENT PRIMARY KEY,
      report_id INT NOT NULL,
      file_url VARCHAR(255) NOT NULL,
      file_type ENUM('image', 'file') DEFAULT 'image',
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      -- 🔗 Foreign key linking to the reports table
      FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE,

      -- 📦 Index for quick lookup by report
      INDEX idx_report_id (report_id)
    );
  `;
  await connection.execute(query);
}

async function feedback(connection) {
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








