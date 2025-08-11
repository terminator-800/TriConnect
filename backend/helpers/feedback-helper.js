async function hasSubmittedFeedback(connection, userId) {
  const [rows] = await connection.execute(
    `SELECT feedback_id FROM feedback WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows.length > 0;
}

async function saveFeedback(connection, userId, role, message) {
  const [result] = await connection.execute(
    `INSERT INTO feedback (user_id, role, message) VALUES (?, ?, ?)`,
    [userId, role, message]
  );

  const [rows] = await connection.execute(
    `SELECT feedback_id, user_id, role, message, created_at 
     FROM feedback WHERE feedback_id = ?`,
    [result.insertId]
  );

  return rows[0];
}

module.exports = { hasSubmittedFeedback, saveFeedback };
