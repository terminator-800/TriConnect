const dbPromise = require("../config/DatabaseConnection");

async function hasSubmittedFeedback(userId) {
  const db = await dbPromise;
  const [rows] = await db.execute(
    `SELECT feedback_id FROM feedback WHERE user_id = ? LIMIT 1`,
    [userId]
  );
  return rows.length > 0;
}

async function saveFeedback(userId, role, message) {
  const db = await dbPromise;
  const [result] = await db.execute(
    `INSERT INTO feedback (user_id, role, message) VALUES (?, ?, ?)`,
    [userId, role, message]
  );

  const [rows] = await db.execute(
    `SELECT feedback_id, user_id, role, message, created_at 
     FROM feedback WHERE feedback_id = ?`,
    [result.insertId]
  );

  return rows[0];
}

module.exports = { hasSubmittedFeedback, saveFeedback };
