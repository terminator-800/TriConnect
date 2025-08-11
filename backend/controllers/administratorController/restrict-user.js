const pool = require("../../config/databaseConnection2");
const {  validateUserId, validateAdminRole, restrictUserInDB } = require("../../helpers/restrict-user-helper");

const restrictUser = async (req, res) => {
    let connection;

    try {
        const { user_id, reason } = req.body;

        // Step 1: Validate inputs and permissions
        validateUserId(user_id);
        validateAdminRole(req.user);

        // Step 2: Get a pooled connection
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Step 3: Perform DB update
        await restrictUserInDB(connection, user_id, reason);

        // Step 4: Commit and release
        await connection.commit();
        connection.release();

        res.json({
            message: 'User restricted successfully',
            user_id,
            new_status: 'restricted'
        });
    } catch (error) {
        console.error('Error restricting user:', error);

        // Rollback if connection was established
        if (connection) {
            await connection.rollback();
            connection.release();
        }

        res.status(error.status || 500).json({
            error: error.message || 'Failed to restrict user'
        });
    }
};

module.exports = {
    restrictUser
}
