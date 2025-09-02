import { getMessageHistoryByConversationId } from '../../messageController/history/get-message-history.js';
import type { Request, Response } from 'express';
import type { PoolConnection } from 'mysql2/promise';
import pool from '../../../../config/database-connection.js';

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
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    connection?.release();
  }
};
