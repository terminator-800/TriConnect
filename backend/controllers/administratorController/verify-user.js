const pool = require("../../config/databaseConnection");

const verifyUser = async (req, res) => {
    const { user_id } = req.params;
    let connection;

    try {
        connection = await pool.getConnection();

        await verifyUsers(connection, user_id);

        res.json({ success: true, message: 'User verified successfully.' });

    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (connection) connection.release(); 
    }
};

async function verifyUsers(connection, user_id) {
    const [userRows] = await connection.execute(
        `SELECT user_id FROM users WHERE user_id = ?`,
        [user_id]
    );
    if (userRows.length === 0) {
        throw new Error('User not found.');
    }

    const [updateResult] = await connection.execute(
        `UPDATE users 
         SET is_verified = ?, is_rejected = ?, verified_at = NOW() 
         WHERE user_id = ?`,
        [true, false, user_id]
    );

    if (updateResult.affectedRows === 0) {
        throw new Error('User verification failed.');
    }

    return { success: true, user_id };
}

module.exports = {
    verifyUser
};
