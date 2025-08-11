async function markRegistered(connection, email) {
    try {
        await connection.execute(
            "UPDATE users SET is_registered = ? WHERE email = ?",
            [1, email]
        );
    } catch (error) {
        console.error("Error marking user as registered:", error);
        throw error;
    }
}

module.exports = {
    markRegistered
}