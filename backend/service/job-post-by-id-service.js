async function getJobPostById(connection, jobPostId) {
  try {
    const [rows] = await connection.query(
      `SELECT * FROM job_post 
       WHERE job_post_id = ?`,
      [jobPostId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in getJobPostById:", error);
    throw error;
  }
};

module.exports = {
    getJobPostById
}