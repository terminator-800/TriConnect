const pool = require("../../config/databaseConnection2");
const { getApplicantsByEmployer } = require("../../service/get-applicants-by-employer-service");

const viewApplicants = async (req, res) => {
  let connection;
  try {
    const employerUserId = req.user?.user_id;
    if (!employerUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = req.query.page;
    const pageSize = req.query.pageSize;

    connection = await pool.getConnection();
    const result = await getApplicantsByEmployer(connection, employerUserId, { page, pageSize });
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching applicants:", error);
    return res.status(500).json({ message: "Failed to fetch applicants" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { viewApplicants };


