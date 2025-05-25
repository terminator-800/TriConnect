const dbPromise = require("../config/DatabaseConnection");

async function createBusinessEmployer(email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO business_employer (email, password) VALUES (?, ?)",
            [email, password]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

async function findBusinessEmployerEmail(email) {
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

async function updateBusinessEmployerPassword(email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "UPDATE business_employer SET password = ? WHERE email = ?",
            [password, email]
        );
        return result; 
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}


module.exports = { createBusinessEmployer, findBusinessEmployerEmail, updateBusinessEmployerPassword };