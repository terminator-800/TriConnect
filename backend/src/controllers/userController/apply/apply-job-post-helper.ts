import fs from "fs";
import path from "path";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const chatUploadDir = path.join(__dirname, "../uploads/chat");

export async function insertJobApplication(
  connection: PoolConnection,
  job_post_id: number,
  applicant_id: number,
  role: string
): Promise<void> {
  await connection.execute(
    `INSERT INTO job_applications (job_post_id, applicant_id, role, applied_at)
     VALUES (?, ?, ?, NOW())`,
    [job_post_id, applicant_id, role]
  );
}

export async function transferTempFilesIfConversationExists(
  connection: PoolConnection,
  sender_id: number,
  receiver_id: number
): Promise<number | null> {
  try {
    const conversation_id = await getConversationId(connection, sender_id, receiver_id);

    if (!conversation_id) {
      console.log("🟡 No existing conversation. Files stay in temp.");
      return null;
    }

    const tempDirs = getTempDirs(sender_id, receiver_id);
    const convDir = moveFilesToConversationDir(tempDirs, conversation_id);

    await saveMovedFilesToDB(connection, convDir, conversation_id, sender_id, receiver_id);

    return conversation_id;
  } catch (err) {
    console.error("❌ Failed to move temp files:", err);
    return null;
  }
}

async function getConversationId(
  connection: PoolConnection,
  sender_id: number,
  receiver_id: number
): Promise<number | null> {
  const [rows] = await connection.query<RowDataPacket[]>(
    `
    SELECT conversation_id FROM conversations 
    WHERE (user1_id = ? AND user2_id = ?) 
       OR (user1_id = ? AND user2_id = ?)
    `,
    [sender_id, receiver_id, receiver_id, sender_id]
  );

  return rows.length > 0 ? Number(rows[0]!.conversation_id) : null;
}

function getTempDirs(sender_id: number, receiver_id: number): string[] {
  return [
    path.join(chatUploadDir, `${sender_id}_${receiver_id}`),
    path.join(chatUploadDir, `${receiver_id}_${sender_id}`),
  ];
}

function moveFilesToConversationDir(tempDirs: string[], conversation_id: number): string {
  const convDir = path.join(chatUploadDir, conversation_id.toString());
  fs.mkdirSync(convDir, { recursive: true });

  for (const tempDir of tempDirs) {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        const oldPath = path.join(tempDir, file);
        const newPath = path.join(convDir, file);
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Moved file to: /uploads/chat/${conversation_id}/${file}`);
      }
      fs.rmSync(tempDir, { recursive: true, force: true });
      break;
    }
  }

  return convDir;
}

async function saveMovedFilesToDB(
  connection: PoolConnection,
  convDir: string,
  conversation_id: number,
  sender_id: number,
  receiver_id: number
): Promise<void> {
  const files = fs.readdirSync(convDir);

  for (const file of files) {
    const filePath = `/uploads/chat/${conversation_id}/${file}`;

    const [existing] = await connection.query<RowDataPacket[]>(
      `SELECT 1 FROM messages WHERE conversation_id = ? AND file_url = ? LIMIT 1`,
      [conversation_id, filePath]
    );

    if (existing.length === 0) {
      await connection.query(
        `INSERT INTO messages (conversation_id, sender_id, receiver_id, message_type, file_url) 
         VALUES (?, ?, ?, 'file', ?)`,
        [conversation_id, sender_id, receiver_id, filePath]
      );
      console.log(`💾 Saved file message to DB: ${file}`);
    } else {
      console.log(`⚠️ Skipped duplicate file: ${file}`);
    }
  }
}
