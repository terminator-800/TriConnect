import { validateUserId, validateAdminRole, restrictUserInDB } from "./restrict-user-helper.js";
import type { CustomRequest } from "../../../types/express/auth.js";
import type { PoolConnection } from "mysql2/promise";
import type { Response } from "express";
import { ROLE } from "../../../utils/roles.js";

import pool from "../../../config/database-connection.js";

interface RestrictUserBody {
    user_id: string | number;
    reason?: string;
}

export const restrictUser = async (req: CustomRequest, res: Response): Promise<void> => {
    let connection: PoolConnection | undefined;

    if (req.user?.role !== ROLE.ADMINISTRATOR) {
        res.status(403).json({ error: "Forbidden: Admins only." });
        return;
    }

    try {
        const { user_id, reason } = req.body as RestrictUserBody;

        validateUserId(user_id);
        validateAdminRole(req.user);

        connection = await pool.getConnection();
        await connection.beginTransaction();

        await restrictUserInDB(connection, user_id, reason);

        await connection.commit();

        res.json({
            message: 'User restricted successfully',
            user_id,
            new_status: 'restricted'
        });
    } catch (error: any) {

        if (connection) {
            await connection.rollback();
        }

        res.status(500).json({
            message: 'Failed to restrict user'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
