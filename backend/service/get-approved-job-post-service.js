async function getApprovedJobPosts(connection) {
    try {
        const [rows] = await connection.query(`
      SELECT 
        jp.*,
        u.full_name,
        u.business_name,
        u.agency_name,
        u.authorized_person,
        u.agency_authorized_person
      FROM job_post jp
      JOIN users u ON jp.user_id = u.user_id
      WHERE jp.status = 'approved'
        AND jp.is_verified_jobpost = 1
        AND jp.jobpost_status = 'active'
    `);
        return rows;
    } catch (error) {
        console.error("Error fetching approved job posts:", error);
        throw error; 
    }
}

module.exports = {
    getApprovedJobPosts
};
