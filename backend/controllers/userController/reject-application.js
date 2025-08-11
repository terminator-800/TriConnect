const pool = require("../../config/databaseConnection2");

const rejectApplication = async (req, res) => {
  let connection;
  try {
    const employerUserId = req.user?.user_id;
    const applicationId = parseInt(req.params.applicationId, 10);

    if (!employerUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Number.isFinite(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    connection = await pool.getConnection();

    const [result] = await connection.query(
      `UPDATE job_applications ja
       JOIN job_post jp ON jp.job_post_id = ja.job_post_id
       SET ja.application_status = 'rejected'
       WHERE ja.application_id = ? AND jp.user_id = ?`,
      [applicationId, employerUserId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found or not owned by employer" });
    }

    return res.status(200).json({ message: "Application rejected successfully" });
  } catch (error) {
    console.error("❌ Error rejecting application:", error);
    return res.status(500).json({ message: "Failed to reject application" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { rejectApplication };


