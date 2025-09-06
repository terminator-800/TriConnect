import type { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { fileURLToPath } from 'url';
import logger from "../config/logger.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FileUpload {
  path: string;
}

interface HandleMessageUploadParams {
  sender_id: number;
  receiver_id: number;
  message?: string;
  files: FileUpload[] | undefined;
}

export const handleMessageUpload = async (
  connection: PoolConnection,
  { sender_id, receiver_id, message, files }: HandleMessageUploadParams,
  ip?: string
) => {

  try {
    const user_small_id = Math.min(sender_id, receiver_id);
    const user_large_id = Math.max(sender_id, receiver_id);

    const [existingRows] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM conversations WHERE user_small_id = ? AND user_large_id = ?`,
      [user_small_id, user_large_id]
    );

    let conversation_id: number;

    if (existingRows.length > 0 && existingRows[0]) {
      conversation_id = existingRows[0].conversation_id;
    } else {
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO conversations (user1_id, user2_id, user_small_id, user_large_id)
         VALUES (?, ?, ?, ?)`,
        [sender_id, receiver_id, user_small_id, user_large_id]
      );
      conversation_id = result.insertId;
    }

    // Insert text message if exists
    if (message && message.trim() !== "") {
      await connection.query(
        `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text, message_type)
         VALUES (?, ?, ?, ?, ?)`,
        [conversation_id, sender_id, receiver_id, message, "text"]
      );
    }

    if (files && files.length > 0) {
      for (const file of files) {
        const normalizedPath = file.path.replace(/\\/g, "/");
        const file_url = normalizedPath;

        await connection.query(
          `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_type, file_url)
           VALUES (?, ?, ?, ?, ?)`,
          [conversation_id, sender_id, receiver_id, "file", file_url]
        );
      }
    }

    // Return the latest message
    const [newMessageRows] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM messages 
       WHERE conversation_id = ? 
       ORDER BY created_at DESC LIMIT 1`,
      [conversation_id]
    );

    const latestMessage = newMessageRows?.[0];
    
    if (!latestMessage) {
      const errMsg = "Failed to retrieve the latest message.";
      logger.error(errMsg, { sender_id, receiver_id, conversation_id, ip });
      throw new Error("Failed to retrieve the latest message.");
    }

    return latestMessage;
  } catch (error) {
    logger.error("Error in handleMessageUpload", { error, sender_id, receiver_id, ip });
    throw new Error("Failed to handle message upload.");
  }
};
