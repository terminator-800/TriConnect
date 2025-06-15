const dbPromise = require("../config/DatabaseConnection");
const createJobPostQuery = async (user_id, role, job_title, job_type, salary_range, location, required_skill, job_description) => {
    try {
        const db = await dbPromise;

        // Insert query with parameters
        const [result] = await db.execute(
            `INSERT INTO job_post (user_id, role, job_title, job_type, salary_range, location, required_skill, job_description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, role, job_title, job_type, salary_range, location, required_skill, job_description]
        );

        // Return the result
        return { success: true, jobId: result.insertId };
    } catch (error) {
        console.error("Error creating job post:", error);
        throw new Error("Failed to create job post");
    }
};

module.exports = { createJobPostQuery };