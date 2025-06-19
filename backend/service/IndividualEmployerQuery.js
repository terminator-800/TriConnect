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

        const [rows] = await db.execute(
            "SELECT individual_employer_id FROM individual_employer WHERE user_id = ?",
            [data.user_id]
        );
        if (!rows.length) return { success: false, message: "Individual employer not found." };

        const query = `
            UPDATE individual_employer SET
                full_name = ?, date_of_birth = ?, phone = ?, gender = ?,
                present_address = ?, permanent_address = ?,
                government_id = ?, selfie_with_id = ?, nbi_barangay_clearance = ?,
                is_submitted = TRUE, is_rejected = FALSE
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

const verifyIndividualEmployer = async (user_id) => {
    const db = await dbPromise;

    const [rows] = await db.execute(
        `SELECT user_id FROM individual_employer WHERE user_id = ?`,
        [user_id]
    );

    if (rows.length === 0) {
        throw new Error('Individual employer not found.');
    }

    const [updateResult] = await db.execute(
        `UPDATE individual_employer 
        SET is_verified = TRUE, 
            verified_at = NOW(), 
            is_rejected = FALSE
        WHERE user_id = ?`,
        [user_id]
    );

    if (updateResult.affectedRows === 0) {
        throw new Error('Update failed - no rows affected.');
    }
};

const rejectIndividualEmployer = async (user_id) => {
    const db = await dbPromise;

    const resetFields = [
        "full_name", "date_of_birth", "phone", "gender",
        "present_address", "permanent_address",
        "government_id", "selfie_with_id", "nbi_barangay_clearance"
    ];

    const [existingRows] = await db.execute(
        `SELECT user_id FROM individual_employer WHERE user_id = ?`,
        [user_id]
    );

    if (existingRows.length === 0) {
        throw new Error('Individual employer not found.');
    }

    const nullifyFields = resetFields.map(f => `${f} = NULL`).join(", ");
    const query = `
        UPDATE individual_employer
        SET ${nullifyFields},
            is_verified = FALSE,
            is_rejected = TRUE,
            is_submitted = FALSE,
            verified_at = NULL
        WHERE user_id = ?
    `;

    const [updateResult] = await db.execute(query, [user_id]);

    if (updateResult.affectedRows === 0) {
        throw new Error('Reject failed - no rows affected.');
    }

    return { success: true, message: "Individual employer rejected and fields reset (files not deleted)." };
};



module.exports = { createIndividualEmployer, 
                    findIndividualEmployerEmail, 
                    updateIndividualEmployerPassword, 
                    uploadIndividualEmployerRequirement,
                    verifyIndividualEmployer,
                    rejectIndividualEmployer
                };