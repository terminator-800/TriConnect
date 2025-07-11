const dbPromise = require("../config/DatabaseConnection");
const fs = require('fs').promises;
const path = require('path');

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

async function getUserInfo(user_id) {
    try {
        const db = await dbPromise;
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error fetching user info by ID:", error);
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

        // Set is_submitted = true and is_rejected = false
        fieldsToUpdate.push("is_submitted = ?", "is_rejected = ?");
        values.push(true, false, data.user_id);

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

// Fetch for admin 
async function fetchAllUser() {
    try {
        const db = await dbPromise;

        const [users] = await db.execute(`
            SELECT 
                user_id,
                role,
                email,
                is_verified,
                is_submitted,
                -- Shared fields
                full_name,
                date_of_birth,
                gender,
                phone,
                present_address,
                permanent_address,
                created_at,

                -- Jobseeker
                education,
                skills,
                government_id,
                selfie_with_id,
                nbi_barangay_clearance,

                -- Business Employer
                business_name,
                business_address,
                industry,
                business_size,
                authorized_person,
                authorized_person_id,
                business_permit_BIR,
                DTI,
                business_establishment,

                -- Manpower Provider
                agency_name,
                agency_address,
                agency_services,
                agency_authorized_person,
                dole_registration_number,
                mayors_permit,
                agency_certificate

            FROM users
            WHERE role IN ('jobseeker', 'business_employer', 'individual_employer', 'manpower_provider')
            ORDER BY created_at DESC
        `);

        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

async function verifyUsers(user_id) {
    const db = await dbPromise;

    const [userRows] = await db.execute(
        `SELECT user_id FROM users WHERE user_id = ?`,
        [user_id]
    );

    if (userRows.length === 0) {
        throw new Error('User not found.');
    }

    const [userUpdateResult] = await db.execute(
        `UPDATE users SET is_verified = ?, is_rejected = ?, verified_at = NOW() WHERE user_id = ?`,
        [true, false, user_id]
    );

    if (userUpdateResult.affectedRows === 0) {
        throw new Error('User verification failed in users table.');
    }

    return { success: true, user_id };
}

async function rejectUsers(user_id) {
    const db = await dbPromise;

    const [userRows] = await db.execute(`SELECT role FROM users WHERE user_id = ?`, [user_id]);
    if (!userRows.length) throw new Error("User not found.");
    const role = userRows[0].role;

    const roleFields = {
        jobseeker: {
            table: "users",
            idField: "user_id",
            resetFields: [
                "full_name", "date_of_birth", "phone", "gender",
                "present_address", "permanent_address", "education", "skills",
                "government_id", "selfie_with_id", "nbi_barangay_clearance"
            ],
            fileFields: ["government_id", "selfie_with_id", "nbi_barangay_clearance"]
        },
        business_employer: {
            table: "users",
            idField: "user_id",
            resetFields: [
                "business_name", "business_address", "industry", "business_size",
                "authorized_person", "authorized_person_id",
                "business_permit_BIR", "DTI", "business_establishment"
            ],
            fileFields: ["authorized_person_id", "business_permit_BIR", "DTI", "business_establishment"]
        },
        individual_employer: {
            table: "users",
            idField: "user_id",
            resetFields: [
                "full_name", "date_of_birth", "phone", "gender",
                "present_address", "permanent_address",
                "government_id", "selfie_with_id", "nbi_barangay_clearance"
            ],
            fileFields: ["government_id", "selfie_with_id", "nbi_barangay_clearance"]
        },
        manpower_provider: {
            table: "users",
            idField: "user_id",
            resetFields: [
                "agency_name", "agency_address", "agency_services",
                "agency_authorized_person", "dole_registration_number",
                "mayors_permit", "agency_certificate", "authorized_person_id"
            ],
            fileFields: ["dole_registration_number", "mayors_permit", "agency_certificate", "authorized_person_id"]
        }
    };

    const config = roleFields[role];
    if (!config) throw new Error(`Unsupported role: ${role}`);

    const { table, idField, resetFields, fileFields } = config;

    const [existingRows] = await db.execute(
        `SELECT ${resetFields.join(", ")} FROM ${table} WHERE ${idField} = ?`,
        [user_id]
    );
    const existingData = existingRows[0] || {};

    // Determine folder path
    const rawName = existingData.full_name || existingData.business_name || existingData.agency_name || "unknown";
    const safeName = rawName.replace(/[^a-zA-Z0-9 _.-]/g, "").trim();

    const folderPath = path.join(__dirname, "..", "uploads", role, user_id.toString(), safeName);

    // Delete each file
    for (const field of fileFields) {
        const fileName = existingData[field];
        if (fileName) {
            const fullPath = path.join(folderPath, fileName);
            try {
                await fs.unlink(fullPath);
            } catch (err) {
                console.warn(`Could not delete file: ${fullPath}`, err.message);
            }
        }
    }

    // Delete the safeName folder
    try {
        await fs.rmdir(folderPath);
    } catch (err) {
        console.warn(`Could not delete folder: ${folderPath}`, err.message);
    }

    // Optionally delete the user_id folder if empty
    const userFolderPath = path.join(__dirname, "..", "uploads", role, user_id.toString());
    try {
        const remainingItems = await fs.readdir(userFolderPath);
        if (remainingItems.length === 0) {
            await fs.rmdir(userFolderPath);
        }
    } catch (err) {
        console.warn(`Could not clean up user folder: ${userFolderPath}`, err.message);
    }

    // Reset fields in database
    const updateQuery = `
        UPDATE ${table}
        SET ${resetFields.map(field => `${field} = NULL`).join(", ")},
            is_verified = false,
            is_submitted = false,
            is_rejected = true,
            verified_at = NULL
        WHERE ${idField} = ?
    `;

    const [updateResult] = await db.execute(updateQuery, [user_id]);
    if (updateResult.affectedRows === 0) throw new Error("Failed to reject user submission.");

    return {
        success: true,
        message: `${role} requirements rejected, files and folders removed, and rejection recorded.`
    };
}

module.exports = {
    findUsersEmail,
    createUsers,
    updateUserPassword,
    uploadUserRequirement,
    getUserInfo,
    fetchAllUser,
    verifyUsers,
    rejectUsers
};