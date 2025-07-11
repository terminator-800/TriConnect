const dbPromise = require("../config/DatabaseConnection");

// get jobpost ID
const getJobPostById = async (jobPostId) => {
  const db = await dbPromise;
  const [rows] = await db.query(
    'SELECT * FROM job_post WHERE job_post_id = ?',
    [jobPostId]
  );
  return rows[0] || null;
};

const findOrCreateAdmin = async ({ email, hashedPassword }) => {
  const db = await dbPromise;

  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ? AND role = 'admin'",
    [email]
  );

  if (rows.length > 0) {
    return { alreadyExists: true, user: rows[0] };
  }

  await db.execute(
    "INSERT INTO users (role, email, password, is_verified) VALUES (?, ?, ?, ?)",
    ['admin', email, hashedPassword, 1]
  );

  return { alreadyExists: false };
};

// Reject job post
const rejectJobPostIfExists = async (jobPostId) => {
  const db = await dbPromise;
  const jobPost = await getJobPostById(jobPostId);

  if (!jobPost) {
    return { success: false, message: 'Jobpost not found.' };
  }

  await db.query(
    `UPDATE job_post 
     SET status = 'rejected', is_verified_jobpost = FALSE
     WHERE job_post_id = ?`,
    [jobPostId]
  );

  return { success: true, message: 'Jobpost rejected successfully.' };
};

// Approve job post
const approveJobPostIfExists = async (jobPostId) => {
  const db = await dbPromise;
  const jobPost = await getJobPostById(jobPostId);

  if (!jobPost) {
    return { success: false, message: 'Jobpost not found.' };
  }

  await db.query(
    `UPDATE job_post
   SET 
     status = 'approved',
     jobpost_status = 'active',
     rejection_reason = NULL,
     approved_at = NOW(),
     is_verified_jobpost = TRUE
   WHERE job_post_id = ?`,
    [jobPostId]
  );


  return { success: true, message: 'Jobpost approved successfully.' };
};

module.exports = { findOrCreateAdmin, rejectJobPostIfExists, approveJobPostIfExists };
