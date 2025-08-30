import type { PoolConnection } from 'mysql2/promise';
import pool from "../../../config/database-connection.js";
import bcrypt from 'bcrypt';
import { findOrCreateAdmin } from './find-create-administrator.js'

export const createAdministrator = async (): Promise <void> => {
    let connection: PoolConnection | undefined;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword){
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
    }

    try {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        connection = await pool.getConnection();
        const result = await findOrCreateAdmin(connection, { email: adminEmail, hashedPassword });

        if (result.alreadyExists) {
            console.log("✅ Admin account already exists.");
        } else {
            console.log("✅ Admin account created.");
        }

    } catch (error) {
        console.error("❌ Error creating admin:", error);
    } finally {
        if (connection) connection.release();
    }
}



