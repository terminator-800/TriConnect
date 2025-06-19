const dbPromise = require("../config/DatabaseConnection");

async function createManpowerProvider(user_id, email, password, role) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO manpower_provider (user_id, email, password, role) VALUES (?, ?, ?, ?)",
            [user_id, email, password, role]
        );
        return { success: true, insertId: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

async function findManpowerProviderEmail(email) {
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

async function updateManpowerProviderPassword(email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "UPDATE manpower_provider SET password = ? WHERE email = ?",
            [password, email]
        );
        return result; 
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}

const uploadManpowerProviderRequirement = async (data) => {
    try {
        const db = await dbPromise;

        const [existing] = await db.execute(
            "SELECT manpower_provider_id FROM manpower_provider WHERE user_id = ?",
            [data.user_id]
        );

        const fields = [
            data.agency_name, data.agency_address, data.agency_services,
            data.agency_authorized_person, data.dole_registration_number,
            data.mayors_permit, data.agency_certificate, data.authorized_person_id
        ];

        if (existing.length) {
            const updateQuery = `
                UPDATE manpower_provider SET
                    agency_name = ?, agency_address = ?, agency_services = ?,
                    agency_authorized_person = ?, dole_registration_number = ?,
                    mayors_permit = ?, agency_certificate = ?, authorized_person_id = ?,
                    is_submitted = ?, is_rejected = FALSE
                WHERE user_id = ?
            `;
            await db.execute(updateQuery, [...fields, true, data.user_id]);
            return { success: true, message: "Manpower provider data updated successfully." };
        }

        return { success: false, message: "Manpower provider not found. Cannot insert new record." };

    } catch (err) {
        console.error("Upload error:", err);
        return { success: false, error: err.message };
    }
};


const verifyManpowerProvider = async (user_id) => {
    const db = await dbPromise;

    const [rows] = await db.execute(
        `SELECT user_id FROM manpower_provider WHERE user_id = ?`,
        [user_id]
    );

    if (rows.length === 0) {
        throw new Error('Manpower Provider not found.');
    }

    const [updateResult] = await db.execute(
        `UPDATE manpower_provider 
        SET is_verified = TRUE, 
        verified_at = NOW(), 
        is_rejected = FALSE
        WHERE user_id = ?`,
        [user_id]
    );

    if (updateResult.affectedRows === 0) {
        throw new Error('Update failed - no rows affected.');
    }

    return { message: 'Manpower Provider verified successfully.' };
};

const rejectManpowerProvider = async (user_id) => {
    const db = await dbPromise;

    const resetFields = [
        "agency_name", "agency_address", "agency_services",
        "agency_authorized_person", "dole_registration_number",
        "mayors_permit", "agency_certificate", "authorized_person_id"
    ];

    const [existingRows] = await db.execute(
        `SELECT user_id FROM manpower_provider WHERE user_id = ?`,
        [user_id]
    );

    if (existingRows.length === 0) {
        throw new Error('Manpower provider not found.');
    }

    const nullifyFields = resetFields.map(f => `${f} = NULL`).join(", ");
    const query = `
        UPDATE manpower_provider
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

    return { success: true, message: "Manpower provider rejected and fields reset (files not deleted)." };
};

module.exports = { createManpowerProvider, 
                    findManpowerProviderEmail, 
                    updateManpowerProviderPassword, 
                    uploadManpowerProviderRequirement, 
                    verifyManpowerProvider, 
                    rejectManpowerProvider 
                };