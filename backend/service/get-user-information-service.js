async function getUserInfo(connection, user_id) {
    try {
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error fetching user info by ID:", error);
        return null;
    } 
}

module.exports = {
    getUserInfo
}