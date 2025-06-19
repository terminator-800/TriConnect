const dbPromise = require("../config/DatabaseConnection");
const fs = require('fs/promises');
const path = require('path');

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
                is_submitted = TRUE, is_rejected = FALSE
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

const verifyJobseeker = async (user_id) => {
    const db = await dbPromise;

    const [jobseekerRows] = await db.execute(
        `SELECT user_id FROM jobseeker WHERE user_id = ?`,
        [user_id]
    );

    if (jobseekerRows.length === 0) {
        throw new Error('Jobseeker not found.');
    }

    const [updateResult] = await db.execute(
        `UPDATE jobseeker 
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

const rejectJobseeker = async (user_id) => {
    const db = await dbPromise;

    const resetFields = [
        "full_name", "date_of_birth", "phone", "gender",
        "present_address", "permanent_address",
        "education", "skills",
        "government_id", "selfie_with_id", "nbi_barangay_clearance"
    ];

    const [existingRows] = await db.execute(
        `SELECT user_id FROM jobseeker WHERE user_id = ?`,
        [user_id]
    );

    if (existingRows.length === 0) {
        throw new Error('Jobseeker not found.');
    }

    const nullifyFields = resetFields.map(f => `${f} = NULL`).join(", ");
    const query = `
        UPDATE jobseeker
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

    return { success: true, message: "Jobseeker rejected and fields reset (files not deleted)." };
};

module.exports = {
    createJobseeker,
    findJobseekerEmail,
    updateJobseekerPassword,
    uploadJobseekerRequirement,
    verifyJobseeker,
    rejectJobseeker
};