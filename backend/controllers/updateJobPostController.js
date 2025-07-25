require('dotenv').config();
const dbPromise = require("../config/DatabaseConnection");

const updateJobPostStatus = async (req, res) => {
  const db = await dbPromise;
  const { jobPostId, status } = req.params;
  const allowedStatuses = ['paused', 'active', 'completed'];
  const normalizedStatus = status.toLowerCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ error: 'Invalid job post status' });
  }

  try {
    const [result] = await db.query(
      'UPDATE job_post SET jobpost_status = ? WHERE job_post_id = ?',
      [normalizedStatus, jobPostId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    res.status(200).json({ message: 'Job post status updated successfully' });
  } catch (error) {
    console.error('Error updating job post status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

module.exports = {
    updateJobPostStatus
}
