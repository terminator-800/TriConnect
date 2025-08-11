const { getJobPostsByUserGrouped } = require("../../service/get-job-post-by-user-grouped-service");
const pool = require("../../config/databaseConnection");

const jobPostsByUser = async (req, res) => {
    let connection;
    const user_id = req.user?.user_id;

    if (!user_id) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    try {
        connection = await pool.getConnection();
        const posts = await getJobPostsByUserGrouped(connection, user_id);
        res.status(200).json(posts);
    } catch (err) {
        console.error("❌ Error fetching job posts:", err);
        res.status(500).json({ message: "Failed to fetch job posts" });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    jobPostsByUser
}