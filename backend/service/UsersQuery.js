const dbPromise = require("../config/DatabaseConnection");

async function createUsers(email, password, role) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            [email, password, role]
        );
        return { success: true, user_id: result.insertId };
    } catch (error) {
        return { success: false, error };
    }
}

async function findUsersEmail(email) {
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

async function updateUserPassword(email, password) {
    try {
        const db = await dbPromise;
        const [result] = await db.execute(
            "UPDATE users SET password = ? WHERE email = ?",
            [password, email]
        );
        return result;
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}

// Dapat sa jobseeker ni na query
async function getJobseekerInfo(user_id) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error fetching jobseeker by ID:", error);
        return null;
    }
}

// Dapat sa businessEmployer ni na query
async function getBusinessEmployerInfo(user_id) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error fetching business employer by ID:", error);
        return null;
    }
}

// Dapat sa manpower provider ni na query
async function getManpowerProviderInfo(user_id) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error fetching manpower provider by user ID:", error);
        return null;
    }
}

// Dapat sa individual employer ni na query
async function getIndividualEmployerInfo(user_id) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error fetching individual employer by ID:", error);
        return null;
    }
}

const uploadUserRequirement = async (data) => {
    try {
        const db = await dbPromise;

        const [rows] = await db.execute(
            "SELECT user_id, role FROM users WHERE user_id = ?",
            [data.user_id]
        );
        if (!rows.length) return { success: false, message: "User not found." };

        const { role } = rows[0];

        const roleAllowedFields = {
            jobseeker: [
                "full_name", "date_of_birth", "phone", "gender",
                "present_address", "permanent_address",
                "education", "skills",
                "government_id", "selfie_with_id", "nbi_barangay_clearance"
            ],
            business_employer: [
                "business_name", "business_address", "industry", "business_size",
                "authorized_person", "authorized_person_id",
                "business_permit_BIR", "DTI", "business_establishment"
            ],
            individual_employer: [
                "full_name", "date_of_birth", "phone", "gender",
                "present_address", "permanent_address",
                "government_id", "selfie_with_id", "nbi_barangay_clearance"
            ],
            manpower_provider: [
                "agency_name", "agency_address", "agency_services",
                "agency_authorized_person", "dole_registration_number",
                "mayors_permit", "agency_certificate", "authorized_person_id"
            ]
        };

        const tableMap = {
            jobseeker: { table: "users", idField: "user_id" },
            business_employer: { table: "users", idField: "user_id" },
            individual_employer: { table: "users", idField: "user_id" },
            manpower_provider: { table: "users", idField: "user_id" }
        };

        const allowedFields = roleAllowedFields[role];
        const { table, idField } = tableMap[role];

        if (!allowedFields || !table || !idField)
            return { success: false, message: `Unsupported role: ${role}` };

        const [roleRows] = await db.execute(
            `SELECT ${idField} FROM ${table} WHERE user_id = ?`,
            [data.user_id]
        );

        if (!roleRows.length)
            await db.execute(`INSERT INTO ${table} (${idField}) VALUES (?)`, [data.user_id]);

        const fieldsToUpdate = [], values = [];

        for (const field of allowedFields) {
            if (field === "phone" && data.contact_number) {
                fieldsToUpdate.push("phone = ?");
                values.push(data.contact_number);
            } else if (data[field] !== undefined) {
                fieldsToUpdate.push(`${field} = ?`);
                values.push(data[field]);
            }
        }

        fieldsToUpdate.push("is_submitted = ?");
        values.push(true, data.user_id);

        const query = `UPDATE ${table} SET ${fieldsToUpdate.join(", ")} WHERE ${idField} = ?`;
        const [result] = await db.execute(query, values);

        return {
            success: true,
            message: `Requirements submitted for ${role}.`,
            affectedRows: result.affectedRows
        };
    } catch (err) {
        console.error("Upload error:", err);
        return { success: false, error: err.message };
    }
};

module.exports = {
    findUsersEmail,
    createUsers,
    updateUserPassword,
    getJobseekerInfo,
    uploadUserRequirement,
    getBusinessEmployerInfo,
    getManpowerProviderInfo,
    getIndividualEmployerInfo
};