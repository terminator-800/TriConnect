const dbPromise = require("../config/DatabaseConnection");

async function createJobseeker(username, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO jobseeker (username, password) VALUES (?, ?)",
            [username, password]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

module.exports = { createJobseeker };