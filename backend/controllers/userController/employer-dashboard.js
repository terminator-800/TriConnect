const pool = require("../../config/DatabaseConnection");
const { format } = require("date-fns");
const { getApplicantsByEmployer } = require("../../service/get-applicants-by-employer-service");

const employerDashboard = async (req, res) => {
  let connection;
  try {
    const employerUserId = req.user?.user_id;
    if (!employerUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    connection = await pool.getConnection();

    // Recent job posts (top 3 by created_at) with applicant count (excluding rejected)
    const [recentPosts] = await connection.query(
      `
      SELECT 
        jp.job_post_id,
        jp.job_title,
        jp.job_type,
        jp.created_at,
        jp.jobpost_status,
        COUNT(CASE WHEN ja.application_status != 'rejected' THEN 1 END) AS applicant_count
      FROM job_post jp
      LEFT JOIN job_applications ja ON ja.job_post_id = jp.job_post_id
      WHERE jp.user_id = ?
        AND (jp.jobpost_status != 'deleted' OR jp.jobpost_status IS NULL)
      GROUP BY jp.job_post_id
      ORDER BY jp.created_at DESC
      LIMIT 3
      `,
      [employerUserId]
    );

    const recentJobPosts = recentPosts.map((row) => ({
      job_post_id: row.job_post_id,
      job_title: row.job_title,
      job_type: row.job_type,
      created_at_formatted: row.created_at ? format(new Date(row.created_at), "MMMM d, yyyy") : "-",
      applicant_count: Number(row.applicant_count || 0),
      jobpost_status: row.jobpost_status || "pending",
    }));

    // Recent applicants (top 5)
    const { applicants } = await getApplicantsByEmployer(connection, employerUserId, { page: 1, pageSize: 5 });

    return res.status(200).json({ recentJobPosts, recentApplicants: applicants });
  } catch (error) {
    console.error("❌ Error building employer dashboard:", error);
    return res.status(500).json({ message: "Failed to load dashboard" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { employerDashboard };


