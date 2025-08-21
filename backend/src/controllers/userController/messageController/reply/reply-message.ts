import type { Request, Response } from 'express';
import type { PoolConnection } from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';
import pool from '../../../../config/database-connection.js';
import { handleMessageUpload } from '../../../../service/handle-message-upload-service.js';
import type { AuthenticatedUser } from '../../../../types/express/auth.js'; // adjust path

// Extend Express Request to include your user and optional files
interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
}

// Payload sent to handleMessageUpload
interface MessagePayload {
  sender_id: number;
  receiver_id: number;
  message: string;
  files: Express.Multer.File[]; // REQUIRED
}

// Resulting uploaded message structure
interface UploadedMessage {
  conversation_id: number;
  file_url?: string;
  message?: string;
  created_at?: string;
  is_read?: boolean;
  sender_name?: string;
}

// MySQL query result types
interface UserRoleRow extends RowDataPacket {
  role: string;
}

interface NameRow extends RowDataPacket {
  full_name: string;
}

export const replyMessage = async (req: AuthenticatedRequest, res: Response) => {
  let connection: PoolConnection | undefined;
  const { receiver_id, message_text } = req.body;
  const sender_id = req.user?.user_id;

  if (!sender_id) return res.status(401).json({ error: 'Unauthorized' });

  try {
    connection = await pool.getConnection();
    if (!connection) return res.status(500).json({ error: 'Database connection not available' });



    console.log('Uploaded files:', req.files);

    // Upload the message
    const rawMessage = await handleMessageUpload(connection, {
      sender_id,
      receiver_id,
      message: message_text,
      files: req.files,
    } as MessagePayload);

    // Transform raw message to strongly typed UploadedMessage
    const newMessage: UploadedMessage = {
      conversation_id: rawMessage.conversation_id,
      file_url: rawMessage.file_url,
      message: rawMessage.message,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    const roomId = newMessage.conversation_id;
    if (!roomId) return res.status(400).json({ error: 'Missing conversation_id' });

    const io = req.app.get('io') as any;
    const userSocketMap = req.app.get('userSocketMap') as Record<number, string>;

    // Get sender name from the correct table
    let senderName = 'Unknown User';
    try {



      const [userResult] = await connection.query<UserRoleRow[]>(
        'SELECT role FROM users WHERE user_id = ?',
        [sender_id]
      );

      if (userResult.length > 0) {
        const senderRole = userResult[0]!.role;
        let tableName: string;

        switch (senderRole) {
          case 'jobseeker':
            tableName = 'jobseekers';
            break;
          case 'business-employer':
            tableName = 'business_employers';
            break;
          case 'individual-employer':
            tableName = 'individual_employers';
            break;
          case 'manpower-provider':
            tableName = 'manpower_providers';
            break;
          case 'administrator':
            tableName = 'administrators';
            break;
          default:
            tableName = 'users';
        }

        const [nameResult] = await connection.query<NameRow[]>(
          `SELECT full_name FROM ${tableName} WHERE user_id = ?`,
          [sender_id]
        );

        if (nameResult.length > 0) senderName = nameResult[0]!.full_name;
      }
    } catch (error: any) {
      console.log('Could not get sender name:', error.message);
    }

    newMessage.sender_name = senderName;

    // Emit to global or fallback room
    if (io?.emitGlobalMessage) {
      io.emitGlobalMessage(newMessage);
      console.log(`📨 Global message emitted for conversation ${roomId}`);
    } else {
      io?.to(roomId.toString()).emit('receiveMessage', newMessage);

      const receiverSocketId = userSocketMap[receiver_id];
      const senderSocketId = userSocketMap[sender_id];

      if (receiverSocketId) io?.to(receiverSocketId).emit('receiveMessage', newMessage);
      if (senderSocketId) io?.to(senderSocketId).emit('receiveMessage', newMessage);
    }

    res.status(201).json({
      message: 'Message sent and stored successfully',
      conversation_id: newMessage.conversation_id,
      file_url: newMessage.file_url || null,
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
};
