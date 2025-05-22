const dbPromise = require("../config/DatabaseConnection");

async function createIndividualEmployer(username, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO individual_employer (username, password) VALUES (?, ?)",
            [username, password]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

async function findIndividualEmployerUsername(username) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM individual_employer WHERE username = ?",
            [username]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        return null;
    }
}


module.exports = { createIndividualEmployer, findIndividualEmployerUsername };