require('dotenv').config();
const pool = require("../../config/DatabaseConnection");
const { updateStatus } = require("../../helpers/update-job-post-status-helper")

const updateJobPostStatus = async (req, res) => {
  let connection;
  const { jobPostId, status } = req.params;
  const allowedStatuses = ['paused', 'active', 'completed'];
  const normalizedStatus = status.toLowerCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ error: 'Invalid job post status' });
  }

  if (isNaN(jobPostId)) {
    return res.status(400).json({ error: 'Invalid job post ID' });
  }

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const result = await updateStatus(connection, normalizedStatus, jobPostId);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Job post not found' });
    }

    await connection.commit();
    res.status(200).json({ message: 'Job post status updated successfully' });
    
  } catch (error) {
    console.error('Error updating job post status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  } finally {
    if (connection) connection.release()
  }
};

module.exports = {
  updateJobPostStatus
}
