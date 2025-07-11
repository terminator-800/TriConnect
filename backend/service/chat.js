const dbPromise = require("../config/DatabaseConnection");
const path = require("path");
const fs = require("fs");

const handleMessageUpload = async ({ sender_id, receiver_id, message, file }) => {
  const db = await dbPromise;
  const user_small_id = Math.min(sender_id, receiver_id);
  const user_large_id = Math.max(sender_id, receiver_id);

  const [existing] = await db.query(
    `SELECT * FROM conversations WHERE user_small_id = ? AND user_large_id = ?`,
    [user_small_id, user_large_id]
  );

  let conversation_id;
  if (existing.length > 0) {
    conversation_id = existing[0].conversation_id;
  } else {
    const [result] = await db.query(
      `INSERT INTO conversations (user1_id, user2_id, user_small_id, user_large_id)
       VALUES (?, ?, ?, ?)`,
      [sender_id, receiver_id, user_small_id, user_large_id]
    );
    conversation_id = result.insertId;
  }

  let file_url = null;
  if (file) {
  const tempPath = path.join(__dirname, '..', 'uploads', 'chat', 'temp', file.filename);
  const destDir = path.join(__dirname, '..', 'uploads', 'chat', conversation_id.toString());
  const destPath = path.join(destDir, file.filename);

  fs.mkdirSync(destDir, { recursive: true });
  fs.renameSync(tempPath, destPath);

  file_url = `/uploads/chat/${conversation_id}/${file.filename}`;
}

  const messageType = file_url ? 'file' : 'text';

  // Insert the new message
  await db.query(
    `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text, message_type, file_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [conversation_id, sender_id, receiver_id, message || null, messageType, file_url]
  );

  // ✅ Fetch and return the newly inserted message
  const [newMessageRows] = await db.query(
    `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1`,
    [conversation_id]
  );

  return newMessageRows[0];
};

// const apply = async (req, res) => {
//   const { sender_id, receiver_id, message, job_post_id } = req.body;

//   try {
//     // ✅ Validate inputs
//     if (!sender_id || !receiver_id || !message || !job_post_id) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const db = await dbPromise;

//     const user_small_id = Math.min(sender_id, receiver_id);
//     const user_large_id = Math.max(sender_id, receiver_id);

//     // ✅ Check if conversation exists
//     const [existing] = await db.query(
//       `SELECT * FROM conversations WHERE user_small_id = ? AND user_large_id = ?`,
//       [user_small_id, user_large_id]
//     );

//     let conversation_id;
//     if (existing.length > 0) {
//       conversation_id = existing[0].conversation_id;
//     } else {
//       const [result] = await db.query(
//         `INSERT INTO conversations (user1_id, user2_id, user_small_id, user_large_id)
//          VALUES (?, ?, ?, ?)`,
//         [sender_id, receiver_id, user_small_id, user_large_id]
//       );
//       conversation_id = result.insertId;
//     }

//     // ✅ Handle file (optional)
//     let file_url = null;
//     if (req.file) {
//       file_url = `/uploads/chat/${conversation_id}/${req.file.filename}`;
//     }

//     const messageType = file_url ? "file" : "text";

//     // ✅ Insert message with job_post_id included
//     const [insertResult] = await db.query(
//       `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text, message_type, file_url, job_post_id)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [
//         conversation_id,
//         sender_id,
//         receiver_id,
//         message,
//         messageType,
//         file_url,
//         job_post_id,
//       ]
//     );

//     // ✅ Fetch the newly inserted message
//     const [newMessageRows] = await db.query(
//       `SELECT * FROM messages WHERE message_id = ?`,
//       [insertResult.insertId]
//     );

//     const newMessage = newMessageRows[0];

//     return res.status(201).json({
//       message: "Message sent and stored",
//       conversation_id: newMessage.conversation_id,
//       file_url: newMessage.file_url,
//     });
//   } catch (error) {
//     console.error("❌ Error sending message (jobseeker):", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

const getOrCreateConversation = async (sender_id, receiver_id) => {
  const db = await dbPromise;
  const user_small_id = Math.min(sender_id, receiver_id);
  const user_large_id = Math.max(sender_id, receiver_id);

  const [existing] = await db.query(
    `SELECT * FROM conversations WHERE user_small_id = ? AND user_large_id = ?`,
    [user_small_id, user_large_id]
  );

  if (existing.length > 0) {
    return existing[0].conversation_id;
  }

  const [result] = await db.query(
    `INSERT INTO conversations (user1_id, user2_id, user_small_id, user_large_id)
     VALUES (?, ?, ?, ?)`,
    [sender_id, receiver_id, user_small_id, user_large_id]
  );

  return result.insertId;
};

module.exports = {
  handleMessageUpload,
  // apply,
  getOrCreateConversation
};