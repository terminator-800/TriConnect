async function updateUserPassword(connection, email, password) {
    try {
        const [result] = await connection.execute(
            "UPDATE users SET password = ? WHERE email = ?",
            [password, email]
        );
        return result;
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}

module.exports = {
    updateUserPassword
}