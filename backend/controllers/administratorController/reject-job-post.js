const pool = require("../../config/DatabaseConnection");
const { getJobPostById } = require("../../service/job-post-by-id-service");

const rejectJobPost = async (req, res) => {
    const jobPostId = req.params.job_post_id;
    let connection;
    try {
        connection = await pool.getConnection();

        const result = await rejectJobPostIfExists(connection, jobPostId);

        if (!result.success) {
            return res.status(404).json({ error: result.message });
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error rejecting jobpost:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    } finally {
        if (connection) connection.release();
    }
};

async function rejectJobPostIfExists(connection, jobPostId) {
  
  try {
    const jobPost = await getJobPostById(connection, jobPostId);
    if (!jobPost) {
      return { success: false, message: 'Jobpost not found.' };
    }

    await connection.query(
      `UPDATE job_post 
       SET 
         status = 'rejected', 
         is_verified_jobpost = FALSE
       WHERE job_post_id = ?`,
      [jobPostId]
    );

    return { success: true, message: 'Jobpost rejected successfully.' };
  } catch (error) {
    console.error("Error in rejectJobPostIfExists:", error);
    throw error;
  }

};

module.exports = {
    rejectJobPost
}