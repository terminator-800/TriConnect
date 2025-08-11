async function updateStatus(connection, status, jobPostId) {
    const [result] = await connection.query(
        'UPDATE job_post SET jobpost_status = ? WHERE job_post_id = ?',
        [status, jobPostId]
    );
    return result;
}

module.exports = { updateStatus };
