import { insertJobApplication } from './apply-job-post-helper.js';
import type { PoolConnection } from 'mysql2/promise';
import { handleMessageUpload } from '../../../service/handle-message-upload-service.js';
import type { CustomRequest } from '../../../types/express/auth.js';
import { uploadToCloudinary } from "../../../utils/upload-to-cloudinary.js";
import type { Response } from 'express';
import logger from '../../../config/logger.js';
import pool from '../../../config/database-connection.js';
import { ROLE } from '../../../utils/roles.js';

interface Message {
  conversation_id?: number;
  file_url?: string;
  created_at?: string;
  is_read?: boolean;
  [key: string]: any;
}

const allowedRoles: typeof ROLE[keyof typeof ROLE][] = [
  ROLE.JOBSEEKER,
  ROLE.MANPOWER_PROVIDER
];

export const apply = async (req: CustomRequest, res: Response) => {
  let connection: PoolConnection | undefined;
  const ip = req.ip;
  const { receiver_id, message, job_post_id } = req.body;
  const sender_id = req.user?.user_id;
  const role = req.user?.role;

  if (!sender_id || !role) {
    return res.status(401).json({ error: 'Unauthorized: missing user info' });
  }

  if (!allowedRoles.includes(role as typeof ROLE[keyof typeof ROLE])) {
    logger.warn("Unauthorized role tried to apply", { sender_id, role, ip });
    return res.status(403).json({ error: "Forbidden: Only authorized users can apply." });
  }

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await insertJobApplication(connection, job_post_id, sender_id, role);

    const uploadedFiles = Array.isArray(req.files)
      ? await Promise.all(
        req.files.map(async (f: any) => {
          const secureUrl = await uploadToCloudinary(f.path, 'job_applications');
          return { path: secureUrl };
        })
      )
      : undefined;

    const newMessage: Message = await handleMessageUpload(connection, {
      sender_id,
      receiver_id,
      message,
      files: uploadedFiles,
    });

    if (!newMessage.conversation_id) {
      await connection.rollback();
      logger.error('Missing conversation_id after message upload', {
        sender_id,
        receiver_id,
        job_post_id,
        uploadedFilesCount: uploadedFiles?.length ?? 0,
        ip
      });
      return res.status(400).json({ error: 'Missing conversation_id' });
    }

    await connection.commit();

    newMessage.created_at = new Date().toISOString();
    newMessage.is_read = false;

    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');
    const roomId = newMessage.conversation_id;

    io.to(roomId.toString()).emit('receiveMessage', newMessage);

    const receiverSocketId = userSocketMap?.[receiver_id];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', newMessage);
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({
      message: 'Application sent and message stored',
      conversation_id: newMessage.conversation_id,
      file_url: newMessage.file_url,
    });

  } catch (error) {
    if (connection) await connection.rollback();
    logger.error('Error applying for job and sending message', {
      error,
      sender_id,
      receiver_id,
      job_post_id,
      filesCount: req.files ? (Array.isArray(req.files) ? req.files.length : Object.values(req.files).flat().length) : 0,
      ip
    });
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        logger.error('Failed to release DB connection in apply', { error: releaseError });
      }
    }
  }
};
