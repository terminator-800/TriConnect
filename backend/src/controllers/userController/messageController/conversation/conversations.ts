import type { Request, Response } from 'express';
import { getUserConversations, type UserConversation } from './get-user-conversations.js';
import pool from '../../../../config/database-connection.js';
import type { PoolConnection } from 'mysql2/promise';

export const conversations = async (req: Request, res: Response): Promise <void> => {
    let connection: PoolConnection | undefined;

    try {
        if (!req.user?.user_id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        connection = await pool.getConnection();
        const user_id = req.user.user_id;

        const rows: UserConversation[] = await getUserConversations(connection, user_id);

        res.json(rows);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        connection?.release();
    }
};
