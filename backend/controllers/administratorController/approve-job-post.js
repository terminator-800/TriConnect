const pool = require("../../config/DatabaseConnection");
const { getJobPostById } = require("../../service/job-post-by-id-service");

const approveJobPost = async (req, res) => {
    const jobPostId = req.params.job_post_id;
    let connection
    try {
        connection = await pool.getConnection();

        const result = await approveJobPostIfExists(connection, jobPostId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error approving jobpost:", error);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        if (connection) connection.release();
    }
};

async function approveJobPostIfExists(connection, jobPostId) {
    
    try {
        const jobPost = await getJobPostById(connection, jobPostId);
        if (!jobPost) {
            return { success: false, message: 'Jobpost not found.' };
        }

        await connection.query(
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
    } catch (error) {
        console.error("Error in approveJobPostIfExists:", error);
        throw error;
    }
};

module.exports = {
    approveJobPost
}