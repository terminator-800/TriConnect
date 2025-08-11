const { addMonths } = require('date-fns');

async function deleteJobPost(connection, jobPostId) {
  const expiresAt = addMonths(new Date(), 1);

  const softDeleteQuery = `
    UPDATE job_post 
    SET jobpost_status = ?, expires_at = ? 
    WHERE job_post_id = ?
  `;

  const [result] = await connection.query(softDeleteQuery, ['deleted', expiresAt, jobPostId]);
  return result;
};

module.exports = {
    deleteJobPost
}