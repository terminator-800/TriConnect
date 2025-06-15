const dbPromise = require("../config/DatabaseConnection");

async function createIndividualEmployer(user_id, role, email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO individual_employer (user_id, role, email, password) VALUES (?, ?, ?, ?)",
            [user_id, role, email, password]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

async function findIndividualEmployerEmail(email) {
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

async function updateIndividualEmployerPassword(email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "UPDATE individual_employer SET password = ? WHERE email = ?",
            [password, email]
        );
        return result; 
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}

const uploadIndividualEmployerRequirement = async (data) => {
    try {
        const db = await dbPromise;

        // Check if individual employer exists
        const [rows] = await db.execute(
            "SELECT individual_employer_id FROM individual_employer WHERE user_id = ?",
            [data.user_id]
        );
        if (!rows.length) return { success: false, message: "Individual employer not found." };

        // Update the record with submitted information and mark as submitted
        const query = `
            UPDATE individual_employer SET
                full_name = ?, date_of_birth = ?, phone = ?, gender = ?,
                present_address = ?, permanent_address = ?,
                government_id = ?, selfie_with_id = ?, nbi_barangay_clearance = ?,
                is_submitted = TRUE
            WHERE user_id = ?`;

        const values = [
            data.full_name, data.date_of_birth, data.phone, data.gender,
            data.present_address, data.permanent_address,
            data.government_id, data.selfie_with_id, data.nbi_barangay_clearance,
            data.user_id
        ];

        const [result] = await db.execute(query, values);

        return {
            success: true,
            message: "Requirements uploaded and submission marked as complete.",
            affectedRows: result.affectedRows
        };
    } catch (err) {
        console.error("Upload error:", err);
        return { success: false, error: err };
    }
};

module.exports = { createIndividualEmployer, 
                    findIndividualEmployerEmail, 
                    updateIndividualEmployerPassword, 
                    uploadIndividualEmployerRequirement 
                };