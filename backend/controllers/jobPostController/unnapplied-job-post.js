const { getUnappliedJobPosts } = require("../../service/get-unnapplied-job-post-service");
const { ROLE } = require("../../utils/roles");
const pool = require("../../config/databaseConnection");

const unappliedJobPosts = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const applicant_id = req.user?.user_id;
        const role = req.user?.role;

        if (!applicant_id || !role) {
            return res.status(401).json({ error: 'Unauthorized: Invalid user token or role' });
        }

        if (role !== ROLE.JOBSEEKER && role !== ROLE.MANPOWER_PROVIDER) {
            return res.status(403).json({ error: 'Forbidden: Only jobseekers and manpower providers can access this endpoint' });
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('applicant id:', applicant_id, '| role:', role);
        }

        const jobPosts = await getUnappliedJobPosts(connection, applicant_id);
        res.status(200).json(jobPosts);
    } catch (err) {
        console.error('Failed to fetch unapplied job posts:', err);
        res.status(500).json({ error: 'Failed to fetch unapplied job posts' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    unappliedJobPosts
}