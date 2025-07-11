const dbPromise = require("../config/DatabaseConnection");

const createJobPostQuery = async (user_id, role, job_title, job_type, salary_range, location, required_skill, job_description) => {
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

// jobPostModel.js
const getAllJobPosts = async () => {
    const db = await dbPromise;
    const [rows] = await db.query(`
        SELECT 
            jp.*, 
            COUNT(ja.application_id) AS applicant_count
        FROM 
            job_post jp
        LEFT JOIN 
            job_applications ja ON jp.job_post_id = ja.job_post_id
        GROUP BY 
            jp.job_post_id
        ORDER BY 
            jp.created_at DESC
    `);
    return rows;
};

const getJobPostById = async (jobPostId) => {
    const db = await dbPromise;
    const [rows] = await db.query(`SELECT * FROM job_post WHERE job_post_id = ?`, [jobPostId]);
    return rows[0] || null;
};

const createJobPostWithSubscriptionLogic = async ({
    user_id,
    role,
    job_title,
    job_type,
    salary_range,
    location,
    required_skill,
    job_description
}) => {
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

const softDeleteJobPostById = async (jobPostId) => {
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
    getAllJobPosts,
    createJobPostWithSubscriptionLogic,
    getJobPostById,
    softDeleteJobPostById
}



