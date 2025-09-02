import type { PoolConnection } from 'mysql2/promise';
import { findOrCreateAdmin } from './find-create-administrator.js'
import bcrypt from 'bcrypt';
import pool from "../../../config/database-connection.js";

export const createAdministrator = async (): Promise<{ success: boolean; message: string }> => {
    let connection: PoolConnection | undefined;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
    }

    try {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        connection = await pool.getConnection();
        const result = await findOrCreateAdmin(connection, { email: adminEmail, hashedPassword });

        if (result.alreadyExists) {
            return { 
                success: true, 
                message: "Administrator account already exists" 
            };
        } else {
            return { 
                success: true, 
                message: "Administrator account created successfully"
            };
        }
    } catch (error) {
        return { 
            success: false, 
            message: "Failed to create administrator"
        };
    } finally {
        if (connection) connection.release();
    }
}



