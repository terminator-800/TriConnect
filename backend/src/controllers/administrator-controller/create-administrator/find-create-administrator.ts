import { INSERT_ADMIN, SELECT_ADMIN_BY_EMAIL } from './queries.js'
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { PoolConnection } from 'mysql2/promise';
import type { AdminData } from '../../../interface/interface.js'
import { ROLE } from '../../../utils/roles.js'

export async function findOrCreateAdmin(connection:  PoolConnection, data: AdminData) {

    try {
        const [rows] = await connection.execute<RowDataPacket[]>(
           SELECT_ADMIN_BY_EMAIL,
            [data.email]
        );

        if (rows.length > 0) {
            return { alreadyExists: true, user: rows[0] };
        }

        const [result] = await connection.execute<ResultSetHeader>(
            INSERT_ADMIN,
            [data.email, data.hashedPassword, 1, 1, 1]
        );

        return {
            alreadyExists: false,
            user: {
                user_id: result.insertId,
                email: data.email,
                role: ROLE.ADMINISTRATOR,
                is_registered: 1,
                is_verified: 1,
                is_submitted: 1,
                verified_at: new Date().toISOString(),
            },
        };
    } catch (error) {
        console.error("Error in findOrCreateAdmin:", error);
        throw error;
    }
};