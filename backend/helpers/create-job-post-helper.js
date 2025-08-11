function validateJobPostInput({
    job_title,
    job_type,
    salary_range,
    location,
    required_skill,
    job_description
}) {
    if (
        !job_title ||
        !job_type ||
        !salary_range ||
        !location ||
        !required_skill ||
        !job_description
    ) {
        return { error: "Please fill out all required fields." };
    }

    const validTypes = ["Full-time", "Part-time", "Contract"];
    if (!validTypes.includes(job_type)) {
        return { error: "Invalid job type." };
    }

    return { valid: true };
}

async function countActiveJobPosts(connection, user_id) {
    const [rows] = await connection.execute(
        `SELECT COUNT(*) AS total 
     FROM job_post 
     WHERE user_id = ? 
     AND status NOT IN ('draft', 'rejected') 
     AND jobpost_status != 'deleted'`,
        [user_id]
    );
    return rows[0].total;
}

async function insertJobPost(connection, {
    user_id,
    role,
    job_title,
    job_type,
    salary_range,
    location,
    required_skill,
    job_description
}) {
    const [result] = await connection.execute(
        `INSERT INTO job_post (
      user_id, role, job_title, job_type, salary_range,
      location, required_skill, job_description,
      status, submitted_at, rejection_reason, is_verified_jobpost, jobpost_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NULL, false, 'pending')`,
        [
            user_id,
            role,
            job_title,
            job_type,
            salary_range,
            location,
            required_skill,
            job_description
        ]
    );
    return result.insertId;
}

module.exports = {
    countActiveJobPosts,
    insertJobPost,
    validateJobPostInput
};

