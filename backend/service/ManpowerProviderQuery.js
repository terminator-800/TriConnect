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
            "SELECT * FROM manpower_provider WHERE email = ?",
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error finding jobseeker by email:", error);
        return null;
    }
}

module.exports = { createManpowerProvider, findManpowerProviderEmail };