/** Validate that a user ID is provided */
function validateUserId(user_id) {
    if (!user_id) {
        const error = new Error('User ID is required');
        error.status = 400;
        throw error;
    }
}

/** Ensure only administrators can restrict users */
function validateAdminRole(user) {
    if (!user || user.role !== 'administrator') {
        const error = new Error('Access denied: Admins only');
        error.status = 403;
        throw error;
    }
}

/** Restrict a user in the database */
async function restrictUserInDB(connection, user_id, reason) {

    await connection.query(
        `UPDATE users 
         SET account_status = 'restricted', 
             status_reason = ?, 
             status_updated_at = NOW()
         WHERE user_id = ?`,
        [reason || 'Violation of terms', user_id]
    );
}

module.exports = {
    validateUserId,
    validateAdminRole,
    restrictUserInDB
};
