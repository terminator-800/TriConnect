const pool = require("../../config/databaseConnection");
const { getRoleConfig, deleteUserFilesAndFolders } = require("../../helpers/reject-user-helper");

const rejectUser = async (req, res) => {
    const { user_id } = req.params;
    let connection;
    try {
        connection = await pool.getConnection();
        await rejectUsers(connection, user_id);

        res.json({ success: true, message: `User rejected successfully (${user_id}).` });

    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }finally{
        if(connection) connection.release();
    }
};

async function rejectUsers(connection, user_id) {
    
    try {
        const [userRows] = await connection.execute(
            `SELECT role FROM users WHERE user_id = ?`, [user_id]
        );
        if (!userRows.length) throw new Error("User not found.");

        const role = userRows[0].role;
        const { table, idField, resetFields, fileFields } = getRoleConfig(role);

        const [existingRows] = await connection.execute(
            `SELECT ${resetFields.join(", ")} FROM ${table} WHERE ${idField} = ?`, [user_id]
        );
        const existingData = existingRows[0] || {};

        const displayName = existingData.full_name || existingData.business_name || existingData.agency_name;
        const fileList = fileFields.map(field => existingData[field]).filter(Boolean);

        await deleteUserFilesAndFolders(role, user_id, displayName, fileList);

        const resetQuery = `
      UPDATE ${table}
      SET ${resetFields.map(f => `${f} = NULL`).join(", ")}
      WHERE ${idField} = ?
    `;
        await connection.execute(resetQuery, [user_id]);

        // Update user table status
        const userStatusQuery = `
      UPDATE users
      SET is_verified = false,
          is_submitted = false,
          is_rejected = true,
          verified_at = NULL
      WHERE user_id = ?
    `;
        await connection.execute(userStatusQuery, [user_id]);

        return {
            success: true,
            message: `${role} requirements rejected, files and folders removed, and rejection recorded.`
        };

    } catch (error) {
        console.error("Error rejecting user:", error);
        throw error;
    }
}

module.exports = {
    rejectUser
}
