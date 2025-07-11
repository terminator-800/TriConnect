async function conversations(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS conversations (
      conversation_id INT AUTO_INCREMENT PRIMARY KEY,
      user1_id INT NOT NULL,
      user2_id INT NOT NULL,
      user_small_id INT NOT NULL,
      user_large_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_pair (user_small_id, user_large_id)
    );
  `;
  await connection.execute(query);
}

module.exports = { conversations };
