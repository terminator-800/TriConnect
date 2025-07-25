const dbPromise = require("../config/DatabaseConnection");

const findOrCreateAdmin = async ({ email, hashedPassword }) => {
  const db = await dbPromise;

  const [rows] = await db.execute(
    `SELECT * FROM users 
     WHERE email = ? 
     AND role = 'administrator'`,
    [email]
  );

  if (rows.length > 0) {
    return { alreadyExists: true, user: rows[0] };
  }

  const [result] = await db.execute(
    `INSERT INTO users (
      email, 
      password, 
      role, 
      is_registered,
      is_verified,
      is_submitted,
      verified_at
    ) VALUES (?, ?, 'administrator', ?, ?, ?, NOW())`,
    [email, hashedPassword, 1, 1, 1]
  );

  return {
    alreadyExists: false,
    user: {
      user_id: result.insertId,
      email,
      role: 'administrator',
      is_registered: 1,
      is_verified: 1,
      is_submitted: 1,
      verified_at: new Date().toISOString(),
    },
  };
};

const getSubmittedUsers = async () => {
  const db = await dbPromise;
  const [rows] = await db.query(`
    SELECT * FROM users 
    WHERE is_submitted = 1 
      AND is_verified != 1
      AND is_registered = 1
      AND role != 'administrator'
  `);

  return rows;
};

const getJobPostById = async (jobPostId) => {
  const db = await dbPromise;
  const [rows] = await db.query(
    `SELECT * FROM job_post 
    WHERE job_post_id = ?`,
    [jobPostId]
  );
  return rows[0] || null;
};

const rejectJobPostIfExists = async (jobPostId) => {
  const db = await dbPromise;
  const jobPost = await getJobPostById(jobPostId);

  if (!jobPost) {
    return { success: false, message: 'Jobpost not found.' };
  }

  await db.query(
    `UPDATE job_post 
   SET 
     status = 'rejected', 
     is_verified_jobpost = FALSE
   WHERE job_post_id = ?`,
    [jobPostId]
  );

  return { success: true, message: 'Jobpost rejected successfully.' };
};

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

const getUserFeedbacks = async () => {
  const db = await dbPromise;

  const [rows] = await db.execute(`
    SELECT 
      f.feedback_id,
      f.role,
      f.message,
      DATE_FORMAT(f.created_at, '%M %d, %Y, at %h:%i %p') AS date_submitted,
      CASE 
        WHEN f.role IN ('jobseeker', 'individual-employer') THEN u.full_name
        WHEN f.role = 'business-employer' THEN u.business_name
        WHEN f.role = 'manpower-provider' THEN u.agency_name
        ELSE NULL
      END AS user_name
    FROM feedback f
    JOIN users u ON f.user_id = u.user_id
    ORDER BY f.created_at DESC
  `);

  return rows;
};

module.exports = {
  findOrCreateAdmin,
  rejectJobPostIfExists,
  approveJobPostIfExists,
  getSubmittedUsers,
  getUserFeedbacks
};
