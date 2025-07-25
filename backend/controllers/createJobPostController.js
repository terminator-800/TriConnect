const { createJobPostWithSubscriptionLogic } = require("../service/jobPostQuery");
const { secureVerifyToken } = require("../utils/secureVerifyToken")
const { ROLE } = require("../utils/roles");

const allowedRoles = [
    ROLE.BUSINESS_EMPLOYER,
    ROLE.INDIVIDUAL_EMPLOYER,
    ROLE.MANPOWER_PROVIDER
];

const createJobPost = async (req, res) => {

    try {
        
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Token not provided." });
        }

        const {user_id, role } = await secureVerifyToken(token);

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ error: "Only authorized employers can create job posts." });
        }
        
        const result = await createJobPostWithSubscriptionLogic({
            user_id,
            role,
            job_title: req.body.job_title,
            job_type: req.body.job_type,
            salary_range: req.body.salary_range,
            location: req.body.location,
            required_skill: req.body.required_skill,
            job_description: req.body.job_description
        });

        if (result.error) {
            return res.status(403).json({ error: result.error });
        }

        res.status(201).json({
            message: "Job post created successfully!",
            job_post_id: result.job_post_id
        });

    } catch (error) {
        console.error("Error creating job post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { createJobPost };
