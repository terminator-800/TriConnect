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
    const [rows] = await db.query("SELECT * FROM job_post");
    return rows;
};

// jobPostQueries.js
async function getUserSubscription(user_id) {
    const db = await dbPromise;
    const [rows] = await db.execute(
        `SELECT is_subscribed, subscription_start, subscription_end FROM users WHERE user_id = ?`,
        [user_id]
    );
    return rows[0];
}

const expireUserSubscription = async (user_id) => {
    const db = await dbPromise;
    await db.execute(
        `UPDATE users SET is_subscribed = 0, subscription_start = NULL, subscription_end = NULL WHERE user_id = ?`,
        [user_id]
    );
    await db.execute(
        `UPDATE job_post SET status = 'draft' WHERE user_id = ?`,
        [user_id]
    );
}

const archiveOldJobPosts = async(user_id) => {
    const db = await dbPromise;
    await db.execute(
        `UPDATE job_post 
         SET status = 'draft' 
         WHERE user_id = ? 
         AND status != 'draft'
         AND (MONTH(submitted_at) < MONTH(CURRENT_DATE()) OR YEAR(submitted_at) < YEAR(CURRENT_DATE()))`,
        [user_id]
    );
}

const getJobPostCountThisMonth = async (user_id) => {
    const db = await dbPromise;
    const [rows] = await db.execute(
        `SELECT COUNT(*) AS postCount 
         FROM job_post 
         WHERE user_id = ? 
         AND status != 'draft'
         AND MONTH(submitted_at) = MONTH(CURRENT_DATE()) 
         AND YEAR(submitted_at) = YEAR(CURRENT_DATE())`,
        [user_id]
    );
    return rows[0].postCount;
}

const insertJobPost = async (data) => {
    const db = await dbPromise;
    const {
        user_id, role, job_title, job_type,
        salary_range, location, required_skill, job_description
    } = data;

    const [result] = await db.execute(
        `INSERT INTO job_post 
         (user_id, role, job_title, job_type, salary_range, location, required_skill, job_description, status, submitted_at, rejection_reason, is_verified_jobpost)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NULL, false)`,
        [user_id, role, job_title, job_type, salary_range, location, required_skill, job_description]
    );

    return result.insertId;
}

module.exports = {
    createJobPostQuery,
    getAllJobPosts,
    getUserSubscription,
    expireUserSubscription,
    archiveOldJobPosts,
    getJobPostCountThisMonth,
    insertJobPost,
};



