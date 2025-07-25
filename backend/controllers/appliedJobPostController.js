const appliedJobPost = async (req, res) => {
  const { user_id } = req.params;
  const db = await dbPromise
  try {
    const [applications] = await db.query(
      `SELECT * FROM job_applications WHERE applicant_id = ? ORDER BY applied_at DESC`,
      [user_id]
    );

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Failed to fetch job applications' });
  }
}

module.exports = {
  appliedJobPost
}