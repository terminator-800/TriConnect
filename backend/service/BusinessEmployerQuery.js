const dbPromise = require("../config/DatabaseConnection");

async function createBusinessEmployer(username, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO business_employer (username, password) VALUES (?, ?)",
            [username, password]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

async function findBusinessEmployerUsername(username) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM business_employer WHERE username = ?",
            [username]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        return null;
    }
}


module.exports = { createBusinessEmployer, findBusinessEmployerUsername };