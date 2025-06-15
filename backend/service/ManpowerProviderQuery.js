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

        // Check if manpower provider entry exists
        const [existing] = await db.execute(
            "SELECT manpower_provider_id FROM manpower_provider WHERE user_id = ?",
            [data.user_id]
        );

        // Fields to be updated
        const fields = [
            data.agency_name, data.agency_address, data.agency_services, data.agency_authorized_person,
            data.dole_registration_number, data.mayors_permit,
            data.agency_certificate, data.authorized_person_id
        ];

        if (existing.length) {
            // If record exists, perform update
            const updateQuery = `
                UPDATE manpower_provider SET
                    agency_name = ?, agency_address = ?, agency_services = ?, agency_authorized_person = ?,
                    dole_registration_number = ?, mayors_permit = ?,
                    agency_certificate = ?, authorized_person_id = ?, is_submitted = TRUE
                WHERE user_id = ?
            `;
            await db.execute(updateQuery, [...fields, data.user_id]);

            return {
                success: true,
                message: "Manpower provider requirements updated successfully."
            };
        }

        // If no existing record, do NOT insert
        return {
            success: false,
            message: "Manpower provider not found. Cannot insert new record."
        };

    } catch (err) {
        console.error("Upload error:", err);
        return { success: false, error: err.message };
    }
};

module.exports = { createManpowerProvider, findManpowerProviderEmail, updateManpowerProviderPassword, uploadManpowerProviderRequirement };