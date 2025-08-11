const pool = require("../../config/DatabaseConnection");
const bcrypt = require('bcrypt');

const createAdministrator = async () => {
    let connection;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    try {
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

async function findOrCreateAdmin(connection, { email, hashedPassword }) {

    try {
        const [rows] = await connection.execute(
            `SELECT * FROM users 
       WHERE email = ? 
       AND role = 'administrator'`,
            [email]
        );

        if (rows.length > 0) {
            return { alreadyExists: true, user: rows[0] };
        }

        const [result] = await connection.execute(
            `INSERT INTO users (
        email, 
        password, 
        role, 
        is_registered,
        is_verified,
        is_submitted,
        verified_at
      ) VALUES (?, ?, 'administrator', ?, ?, ?, NOW())`,
            [email, hashedPassword, 1, 1, 1]
        );

        return {
            alreadyExists: false,
            user: {
                user_id: result.insertId,
                email,
                role: 'administrator',
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

module.exports = {
    createAdministrator
}