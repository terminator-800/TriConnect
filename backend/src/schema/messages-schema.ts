import type { Pool, PoolConnection } from 'mysql2/promise';

export async function createMessagesTable(connection: Pool | PoolConnection) {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      message_id INT AUTO_INCREMENT PRIMARY KEY,
      conversation_id INT NOT NULL,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      read_at DATETIME NULL,
      is_read BOOLEAN DEFAULT FALSE,
      message_text TEXT,
      message_type ENUM('text', 'image', 'file') DEFAULT 'text',
      file_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
      INDEX idx_conversation_id (conversation_id),
      INDEX idx_receiver_id (receiver_id)
    );
  `;
  await connection.execute(query);
}

