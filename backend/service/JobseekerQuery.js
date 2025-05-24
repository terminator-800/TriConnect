const dbPromise = require("../config/DatabaseConnection");

async function createJobseeker(email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO jobseeker (email, password) VALUES (?, ?)",
            [email, password]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

async function findJobseekerEmail(email) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM jobseeker WHERE email = ?",
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error finding jobseeker by email:", error);
        return null;
    }
}

module.exports = { createJobseeker, findJobseekerEmail };