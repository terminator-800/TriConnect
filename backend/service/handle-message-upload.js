const path = require("path");
const fs = require("fs");

const handleMessageUpload = async (connection, { sender_id, receiver_id, message, files }) => {
  try {
    const user_small_id = Math.min(sender_id, receiver_id);
    const user_large_id = Math.max(sender_id, receiver_id);

    const [existing] = await connection.query(
      `SELECT * FROM conversations WHERE user_small_id = ? AND user_large_id = ?`,
      [user_small_id, user_large_id]
    );

    let conversation_id;
    if (existing.length > 0) {
      conversation_id = existing[0].conversation_id;
    } else {
      const [result] = await connection.query(
        `INSERT INTO conversations (user1_id, user2_id, user_small_id, user_large_id)
         VALUES (?, ?, ?, ?)`,
        [sender_id, receiver_id, user_small_id, user_large_id]
      );
      conversation_id = result.insertId;
    }

    // Insert message_text if exists
    if (message && message.trim() !== '') {
      await connection.query(
        `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text, message_type)
         VALUES (?, ?, ?, ?, ?)`,
        [conversation_id, sender_id, receiver_id, message, 'text']
      );
    }

    const destDir = path.join(__dirname, '..', 'uploads', 'chat', conversation_id.toString());
    await fs.promises.mkdir(destDir, { recursive: true });

    if (files && files.length > 0) {
      for (const file of files) {
        const normalizedPath = file.path.replace(/\\/g, '/'); // for Windows compatibility
        const file_url = `/${normalizedPath}`;

        await connection.query(
          `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_type, file_url)
       VALUES (?, ?, ?, ?, ?)`,
          [conversation_id, sender_id, receiver_id, 'file', file_url]
        );
      }
    }


    // Return latest message
    const [newMessageRows] = await connection.query(
      `SELECT * FROM messages 
       WHERE conversation_id = ? 
       ORDER BY created_at DESC LIMIT 1`,
      [conversation_id]
    );

    return newMessageRows[0];
  } catch (error) {
    console.error("❌ handleMessageUpload failed:", error);
    throw error;
  }
};


module.exports = {
  handleMessageUpload,
};
