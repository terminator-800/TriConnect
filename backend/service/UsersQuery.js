const dbPromise = require("../config/DatabaseConnection");

async function createUsers(email, password, role) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            [email, password, role]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

async function findUsersEmail(email) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        return null;
    }
}




module.exports = { findUsersEmail, createUsers };