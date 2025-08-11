const { createJobPosts } = require("../../service/create-job-post-service"); 
const { ROLE } = require("../../utils/roles");
const pool = require("../../config/databaseConnection2");

const allowedRoles = [
    ROLE.BUSINESS_EMPLOYER,
    ROLE.INDIVIDUAL_EMPLOYER,
    ROLE.MANPOWER_PROVIDER,
];

const createJobPost = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { user_id, role } = req.user;
   
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                error: "Forbidden: Only authorized employers can create job posts.",
            });
        }

        const {
            job_title,
            job_type,
            salary_range,
            location,
            required_skill,
            job_description,
        } = req.body;

        const result = await createJobPosts(connection, {
            user_id,
            role,
            job_title,
            job_type,
            salary_range,
            location,
            required_skill,
            job_description,
        });

        if (result?.error) {
            return res.status(403).json({ error: result.error });
        }

        return res.status(201).json({
            message: "Job post created successfully.",
            job_post_id: result.job_post_id,
        });

    } catch (error) {
        console.error("❌ Error creating job post:", error);
        return res.status(500).json({ error: "Internal server error." });
    } finally{
        if (connection) connection.release();
    }
};

module.exports = { createJobPost };
