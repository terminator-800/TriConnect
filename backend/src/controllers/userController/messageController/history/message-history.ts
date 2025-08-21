import type { Request, Response } from 'express';
import pool from '../../../../config/database-connection.js';
import { getMessageHistoryByConversationId } from '../../messageController/history/get-message-history.js';
import type { PoolConnection } from 'mysql2/promise';

export const messageHistory = async (req: Request, res: Response): Promise<void> => {
  let connection: PoolConnection | undefined;

  try {
    const conversation_id = req.params.conversation_id;

    if (!conversation_id) {
      res.status(400).json({ error: 'conversation_id is required' });
      return;
    }

    connection = await pool.getConnection();

    const messages = await getMessageHistoryByConversationId(connection, conversation_id);

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    connection?.release();
  }
};
