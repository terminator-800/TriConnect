async function findUsersEmail(connection, email) {
    try {
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error finding user by email:", error);
        return null;
    }
}

module.exports = {
    findUsersEmail
}