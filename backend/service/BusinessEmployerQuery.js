const dbPromise = require("../config/DatabaseConnection");

async function createBusinessEmployer(user_id, role, email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO business_employer (user_id, role, email, password) VALUES (?, ?, ?, ?)",
            [user_id, role, email, password]
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

const uploadBusinessEmployerRequirement = async (data) => {
    try {
        const db = await dbPromise;

        // Check if the business employer entry exists for the user
        const [existing] = await db.execute(
            "SELECT business_employer_id FROM business_employer WHERE user_id = ?",
            [data.user_id]
        );

        const fields = [
            data.business_name, data.business_address, data.industry, data.business_size,
            data.authorized_person, data.authorized_person_id,
            data.business_permit_BIR, data.DTI, data.business_establishment
        ];

        if (existing.length) {
            // Update the record if it exists
            const updateQuery = `
                UPDATE business_employer SET
                    business_name = ?, business_address = ?, industry = ?, business_size = ?,
                    authorized_person = ?, authorized_person_id = ?,
                    business_permit_BIR = ?, DTI = ?, business_establishment = ?, is_submitted = ?
                WHERE user_id = ?
            `;
            await db.execute(updateQuery, [...fields, true, data.user_id]);
            return { success: true, message: "Business employer data updated successfully." };
        }

        // Do not insert if not found
        return { success: false, message: "Business employer not found. Cannot insert new record." };

    } catch (err) {
        console.error("Upload error:", err);
        return { success: false, error: err.message };
    }
};

module.exports = { createBusinessEmployer, 
                findBusinessEmployerEmail, 
                updateBusinessEmployerPassword,
                uploadBusinessEmployerRequirement
            };