const pool = require("../../config/databaseConnection");
const { ROLE } = require("../../utils/roles");
const { format } = require("date-fns");

const pendingJobPosts = async (req, res) => {
    let connection
    try {
        connection = await pool.getConnection();
        const jobposts = await getPendingJobPosts(connection);

        res.status(200).json(jobposts);
    } catch (error) {
        console.error("Failed to fetch job posts:", error);
        res.status(500).json({ message: "Failed to fetch job posts" });
    } finally {
        if (connection) connection.release();
    }
};

async function getPendingJobPosts(connection) {
    const query = `
    SELECT 
      jp.job_post_id,
      jp.user_id,
      jp.job_title,
      jp.job_description,
      jp.location,
      jp.salary_range,
      jp.required_skill,
      jp.created_at,
      jp.job_type,
      u.role,

      -- Business employer fields
      be.business_name,
      be.business_address,
      be.industry,
      be.business_size,
      be.authorized_person AS be_authorized_person,

      -- Individual employer fields
      ie.full_name AS individual_full_name,
      ie.gender AS individual_gender,
      ie.present_address AS individual_present_address,

      -- Manpower provider fields
      mp.agency_name,
      mp.agency_address,
      mp.agency_services,
      mp.agency_authorized_person

    FROM job_post jp
    JOIN users u ON jp.user_id = u.user_id

    LEFT JOIN business_employer be 
      ON u.user_id = be.business_employer_id AND u.role = 'business-employer'

    LEFT JOIN individual_employer ie 
      ON u.user_id = ie.individual_employer_id AND u.role = 'individual-employer'

    LEFT JOIN manpower_provider mp 
      ON u.user_id = mp.manpower_provider_id AND u.role = 'manpower-provider'

    WHERE jp.jobpost_status = 'pending'
      AND jp.status = 'pending'

    ORDER BY jp.created_at DESC;
  `;

    try {
        const [rows] = await connection.query(query);

        const formatted = rows.map(post => {
            const base = {
                job_post_id: post.job_post_id,
                user_id: post.user_id,
                job_title: post.job_title,
                job_description: post.job_description,
                location: post.location,
                salary_range: post.salary_range,
                required_skill: post.required_skill,
                job_type: post.job_type,
                role: post.role,
                created_at: post.created_at ? format(new Date(post.created_at), "MMMM d, yyyy 'at' hh:mm a") : null
            };

            if (post.role === ROLE.BUSINESS_EMPLOYER) {
                return {
                    ...base,
                    employer_name: post.business_name,
                    submitted_by: post.be_authorized_person,
                    business_name: post.business_name,
                    business_address: post.business_address,
                    industry: post.industry,
                    business_size: post.business_size,
                    authorized_person: post.be_authorized_person
                };
            }

            if (post.role === ROLE.INDIVIDUAL_EMPLOYER) {
                return {
                    ...base,
                    employer_name: post.individual_full_name,
                    submitted_by: post.individual_full_name,
                    full_name: post.individual_full_name,
                    gender: post.individual_gender,
                    present_address: post.individual_present_address
                };
            }

            if (post.role === ROLE.MANPOWER_PROVIDER) {
                return {
                    ...base,
                    employer_name: post.agency_name,
                    submitted_by: post.agency_authorized_person,
                    agency_name: post.agency_name,
                    agency_address: post.agency_address,
                    agency_services: post.agency_services,
                    agency_authorized_person: post.agency_authorized_person
                };
            }

            return base;
        });

        return formatted;
    } catch (error) {
        console.error('Error fetching pending job posts:', error);
        throw error;
    }
}

module.exports = {
    pendingJobPosts
}