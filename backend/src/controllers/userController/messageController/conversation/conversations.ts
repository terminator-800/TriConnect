import type { Request, Response } from 'express';
import { getUserConversations, type UserConversation } from './get-user-conversations.js';
import type { PoolConnection } from 'mysql2/promise';
import pool from '../../../../config/database-connection.js';
import logger from '../../../../config/logger.js';
import type { AuthenticatedUser } from '../../../../types/express/auth.js';

export const conversations = async (req: Request, res: Response): Promise<void> => {
    let connection: PoolConnection | undefined;
    const ip = req.ip;
    const user_id = (req.user as AuthenticatedUser)?.user_id;

    try {

        if (!user_id) {
            logger.warn("Unauthorized access attempt to fetch conversations", { ip });
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        connection = await pool.getConnection();

        const rows: UserConversation[] = await getUserConversations(connection, user_id);

        res.json(rows);
    } catch (err) {
        logger.error("Unexpected error fetching conversations", { error: err, user_id, ip });
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) {
            try {
                connection.release();
            } catch (releaseError) {
                logger.error("Failed to release DB connection", { error: releaseError, user_id, ip });
            }
        }
    }
}

