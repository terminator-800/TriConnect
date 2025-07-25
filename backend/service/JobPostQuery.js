const dbPromise = require("../config/DatabaseConnection");
const { addMonths } = require('date-fns');

async function createJobPostQuery(user_id, role, job_title, job_type, salary_range, location, required_skill, job_description) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            `INSERT INTO job_post (user_id, role, job_title, job_type, salary_range, location, required_skill, job_description, status, submitted_at, rejection_reason, is_verified_jobpost)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
            [
                user_id, role, job_title, job_type, salary_range, location,
                required_skill, job_description, 'pending', null, false
            ]
        );

        return { success: true, jobId: result.insertId };
    } catch (error) {
        console.error("Error creating job post:", error);
        throw new Error("Failed to create job post");
    }
};

async function getApprovedJobPosts() {
    const db = await dbPromise;
    const [rows] = await db.query(`
    SELECT 
      jp.*,
      u.full_name,
      u.business_name,
      u.agency_name,
      u.authorized_person,
      u.agency_authorized_person
    FROM job_post jp
    JOIN users u ON jp.user_id = u.user_id
    WHERE jp.status = 'approved'
      AND jp.is_verified_jobpost = 1
      AND jp.jobpost_status = 'active'
  `);
    return rows;
};


async function getUnappliedJobPosts(applicant_id) {
    const db = await dbPromise;

    const [jobPosts] = await db.query(
        `
    SELECT 
      jp.*, 
      u.full_name, 
      u.business_name, 
      u.agency_name,
      u.authorized_person,
      u.agency_authorized_person
    FROM job_post jp
    LEFT JOIN users u ON jp.user_id = u.user_id
    WHERE jp.status = 'approved'
      AND jp.is_verified_jobpost = 1
      AND jp.jobpost_status = 'active'
      AND jp.user_id != ? -- 🔹 exclude user's own job posts
      AND jp.job_post_id NOT IN (
        SELECT ja.job_post_id
        FROM job_applications ja
        WHERE ja.applicant_id = ?
      )
    `,
        [applicant_id, applicant_id]
    );

    return jobPosts;
};

async function getPendingJobPosts(user_id) {
    const db = await dbPromise;

    const [rows] = await db.query(`
    SELECT 
      jp.*, 
      u.full_name,
      u.business_name,
      u.agency_name,
      COUNT(ja.application_id) AS applicant_count
    FROM 
      job_post jp
    LEFT JOIN 
      users u ON jp.user_id = u.user_id
    LEFT JOIN 
      job_applications ja ON jp.job_post_id = ja.job_post_id
    WHERE 
      (? IS NULL OR jp.user_id = ?) 
      AND jp.status = 'pending'
      AND COALESCE(jp.jobpost_status, '') != 'deleted'
    GROUP BY 
      jp.job_post_id
    ORDER BY 
      jp.created_at DESC
  `, [user_id, user_id]);

    return rows;
}


const getJobPostById = async (jobPostId) => {
    const db = await dbPromise;
    const [rows] = await db.query(`SELECT * FROM job_post WHERE job_post_id = ?`, [jobPostId]);
    return rows[0] || null;
};

async function createJobPostWithSubscriptionLogic({
    user_id,
    role,
    job_title,
    job_type,
    salary_range,
    location,
    required_skill,
    job_description
}) {
    const db = await dbPromise;

    // Step 1: Validate required fields
    const requiredFields = [job_title, job_type, salary_range, location, required_skill, job_description];
    if (requiredFields.some(field => !field)) {
        return { error: "All required fields must be filled out." };
    }

    const validJobTypes = ["Full-time", "Part-time", "Contract"];
    if (!validJobTypes.includes(job_type)) {
        return { error: "Invalid job type." };
    }

    // Step 2: Get subscription info
    const [userRows] = await db.execute(
        `SELECT is_subscribed, subscription_end FROM users WHERE user_id = ?`,
        [user_id]
    );

    if (userRows.length === 0) {
        return { error: "User not found." };
    }

    let { is_subscribed, subscription_end } = userRows[0];

    // Step 3: Expire subscription if past end date
    if (is_subscribed && new Date(subscription_end) < new Date()) {
        await db.execute(
            `UPDATE users SET is_subscribed = 0, subscription_start = NULL, subscription_end = NULL WHERE user_id = ?`,
            [user_id]
        );

        await db.execute(
            `UPDATE job_post SET status = 'draft' WHERE user_id = ?`,
            [user_id]
        );

        is_subscribed = 0;
    }

    // Step 4: Archive old posts if user is not subscribed
    if (!is_subscribed) {
        await db.execute(
            `UPDATE job_post
       SET status = 'draft'
       WHERE user_id = ?
       AND status != 'draft'
       AND (MONTH(submitted_at) < MONTH(CURRENT_DATE()) OR YEAR(submitted_at) < YEAR(CURRENT_DATE()))`,
            [user_id]
        );
    }

    // Step 5: Count current month's posts
    const [countRows] = await db.execute(
        `SELECT COUNT(*) AS postCount
     FROM job_post
     WHERE user_id = ?
     AND status != 'draft'
     AND MONTH(submitted_at) = MONTH(CURRENT_DATE())
     AND YEAR(submitted_at) = YEAR(CURRENT_DATE())`,
        [user_id]
    );

    const postCount = countRows[0].postCount;
    const postLimit = is_subscribed ? 10 : 3;

    if (postCount >= postLimit) {
        return {
            error: `You have reached the maximum of ${postLimit} job posts this month.` +
                (is_subscribed ? '' : ' Please upgrade your subscription.')
        };
    }

    // Step 6: Insert the job post
    const [insertResult] = await db.execute(
        `INSERT INTO job_post
     (user_id, role, job_title, job_type, salary_range, location, required_skill, job_description, status, submitted_at, rejection_reason, is_verified_jobpost)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NULL, false)`,
        [user_id, role, job_title, job_type, salary_range, location, required_skill, job_description]
    );

    return { success: true, job_post_id: insertResult.insertId };
};

async function getJobPostsByUserGrouped(user_id) {
    const db = await dbPromise;

    const [rows] = await db.query(`
    SELECT 
      jp.*, 
      u.full_name, 
      u.business_name, 
      u.agency_name,
      COUNT(ja.application_id) AS applicant_count,
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
    LEFT JOIN users u ON jp.user_id = u.user_id
    LEFT JOIN job_applications ja ON jp.job_post_id = ja.job_post_id
    WHERE jp.user_id = ?
      AND (jp.jobpost_status != 'deleted' OR jp.jobpost_status IS NULL)
      AND (
        (jp.status = 'pending') OR
        (jp.status = 'approved' AND jp.jobpost_status IN ('active', 'paused', 'completed'))
      )
    GROUP BY jp.job_post_id
    ORDER BY jp.created_at DESC
  `, [user_id]);

    const grouped = { pending: [], active: [], completed: [] };
    for (const row of rows) {
        if (row.category) grouped[row.category].push(row);
    }

    return grouped;
}

async function softDeleteJobPostById(jobPostId) {
    const expiresAt = addMonths(new Date(), 1);

    const db = await dbPromise;

    const softDeleteQuery = `
    UPDATE job_post 
    SET jobpost_status = ?, expires_at = ? 
    WHERE job_post_id = ?
  `;

    const [result] = await db.query(softDeleteQuery, ['deleted', expiresAt, jobPostId]);
    return result;
};

module.exports = {
    createJobPostQuery,
    getApprovedJobPosts,
    getUnappliedJobPosts,
    getJobPostsByUserGrouped,
    getPendingJobPosts,
    createJobPostWithSubscriptionLogic,
    getJobPostById,
    softDeleteJobPostById,
}



