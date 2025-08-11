const { getApprovedJobPosts } = require("../../service/get-approved-job-post-service");
const pool = require("../../config/databaseConnection");

const approvedJobPosts = async (req, res) => {
    let connection
    try {
        connection = await pool.getConnection();

        const jobPosts = await getApprovedJobPosts(connection);

        res.json(jobPosts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch approved job posts' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    approvedJobPosts
}