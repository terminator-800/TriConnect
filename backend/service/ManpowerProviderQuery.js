const dbPromise = require("../config/DatabaseConnection");

async function createManpowerProvider(email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO manpower_provider (email, password) VALUES (?, ?)",
            [email, password]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

async function findManpowerProviderEmail(email) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error finding jobseeker by email:", error);
        return null;
    }
}

async function updateManpowerProviderPassword(email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "UPDATE manpower_provider SET password = ? WHERE email = ?",
            [password, email]
        );
        return result; 
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}

module.exports = { createManpowerProvider, findManpowerProviderEmail, updateManpowerProviderPassword };