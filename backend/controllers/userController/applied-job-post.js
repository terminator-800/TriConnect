// const pool = require("../../config/DatabaseConnection");

// const appliedJobPost = async (req, res) => {
//   const { user_id } = req.params;
//   let connection;

//   try {
//     connection = await pool.getConnection();
//     const applications = await getApplicationsByUserId(connection, user_id);
//     res.status(200).json(applications);
//   } catch (error) {
//     console.error('Error fetching job applications:', error);
//     res.status(500).json({ error: 'Failed to fetch job applications' });
//   } finally {
//     if (connection) connection.release()
//   }
// };


// const getApplicationsByUserId = async (connection, user_id) => {
//   const [applications] = await connection.query(
//     `SELECT * FROM job_applications WHERE applicant_id = ? ORDER BY applied_at DESC`,
//     [user_id]
//   );
//   return applications;
// };

// module.exports = {
//   appliedJobPost
// }