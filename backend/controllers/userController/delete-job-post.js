require('dotenv').config();
const { deleteJobPost } = require("../../service/delete-job-post-service");
const { getJobPostById } = require("../../service/job-post-by-id-service");
const pool = require("../../config/DatabaseConnection");

const softDeleteJobPost = async (req, res) => {
    const deleted = 'deleted';
    const { jobPostId } = req.params;

    if (isNaN(jobPostId)) {
        return res.status(400).json({ error: 'Invalid job post ID' });
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const jobPost = await getJobPostById(connection, jobPostId);

        if (!jobPost) {
            await connection.rollback();
            return res.status(404).json({ error: 'Job post not found' });
        }

        if (jobPost.jobpost_status === deleted) {
            await connection.rollback();
            return res.status(400).json({ error: 'Job post is already marked as deleted.' });
        }

        await deleteJobPost(connection, jobPostId);

        await connection.commit();

        return res.status(200).json({ message: 'Job post marked as deleted. Will be removed after 1 month.' });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error soft-deleting job post:', err);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    softDeleteJobPost
};
