const dbPromise = require("../config/DatabaseConnection");

async function createJobseeker(user_id, role, email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO jobseeker (user_id, email, password, role) VALUES (?, ?, ?, ?)",
            [user_id, email, password, role]
        );
        return { success: true, jobseeker_id: result.insertId };
    } catch (error) {
        console.error("Jobseeker insertion error:", error);
        return { success: false, error };
    }
}

async function findJobseekerEmail(email) {
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

async function updateJobseekerPassword(email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "UPDATE jobseeker SET password = ? WHERE email = ?",
            [password, email]
        );
        return result;
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}

const uploadJobseekerRequirement = async (data) => {
    try {
        const db = await dbPromise;

        const [rows] = await db.execute(
            "SELECT jobseeker_id FROM jobseeker WHERE user_id = ?",
            [data.user_id]
        );
        if (!rows.length) return { success: false, message: "Jobseeker not found." };

        const query = `
            UPDATE jobseeker SET
                full_name = ?, date_of_birth = ?, phone = ?, gender = ?,
                present_address = ?, permanent_address = ?, education = ?, skills = ?,
                government_id = ?, selfie_with_id = ?, nbi_barangay_clearance = ?,
                is_submitted = TRUE
            WHERE user_id = ?`;

        const values = [
            data.full_name, data.date_of_birth, data.contact_number, data.gender,
            data.present_address, data.permanent_address, data.education, data.skills,
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



module.exports = {
    createJobseeker,
    findJobseekerEmail,
    updateJobseekerPassword,
    uploadJobseekerRequirement
};