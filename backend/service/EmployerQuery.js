const dbPromise = require("../config/DatabaseConnection");

async function createEmployer(username, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO employer (username, password) VALUES (?, ?)",
            [username, password]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

module.exports = { createEmployer };