// const bcrypt = require('bcrypt');
// const fs = require('fs').promises;
// const path = require('path');
// const { ROLE } = require("../utils/roles")
// const pool = require("../config/DatabaseConnection");

// // create users
// // async function createUsers(pool, email, hashedPassword, role) {
// //     const connection = await pool.getConnection();
// //     try {
// //         await connection.beginTransaction();

// //         const [result] = await connection.execute(
// //             "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
// //             [email, hashedPassword, role]
// //         );

// //         const userId = result.insertId;

// //         // Insert into role-specific table
// //         switch (role) {
// //             case 'jobseeker':
// //                 await connection.execute(
// //                     "INSERT INTO jobseeker (jobseeker_id) VALUES (?)",
// //                     [userId]
// //                 );
// //                 break;

// //             case 'business-employer':
// //                 await connection.execute(
// //                     "INSERT INTO business_employer (business_employer_id) VALUES (?)",
// //                     [userId]
// //                 );
// //                 break;

// //             case 'individual-employer':
// //                 await connection.execute(
// //                     "INSERT INTO individual_employer (individual_employer_id) VALUES (?)",
// //                     [userId]
// //                 );
// //                 break;

// //             case 'manpower-provider':
// //                 await connection.execute(
// //                     "INSERT INTO manpower_provider (manpower_provider_id) VALUES (?)",
// //                     [userId]
// //                 );
// //                 break;

// //             case 'administrator':
// //                 await connection.execute(
// //                     "INSERT INTO administrator (administrator_id) VALUES (?)",
// //                     [userId]
// //                 );
// //                 break;

// //             default:
// //                 throw new Error("Unsupported role type.");
// //         }

// //         await connection.commit();
// //         return { success: true, user_id: userId };

// //     } catch (error) {
// //         await connection.rollback();
// //         return { success: false, error };
// //     } finally {
// //         connection.release();
// //     }
// // }

// // find user email
// // async function findUsersEmail(pool, email) {
// //     let connection;
// //     try {
// //         connection = await pool.getConnection();
// //         const [rows] = await connection.execute(
// //             "SELECT * FROM users WHERE email = ?",
// //             [email]
// //         );
// //         return rows.length > 0 ? rows[0] : null;
// //     } catch (error) {
// //         console.error("Error finding user by email:", error);
// //         return null;
// //     } finally {
// //         if (connection) connection.release();
// //     }
// // }

// // async function markRegistered(pool, email) {
// //     const connection = await pool.getConnection();
// //     try {
// //         await connection.execute(
// //             "UPDATE users SET is_registered = ? WHERE email = ?",
// //             [1, email]
// //         );
// //     } catch (error) {
// //         console.error("Error marking user as registered:", error);
// //         throw error;
// //     } finally {
// //         connection.release();
// //     }
// // }

// // async function updateUserPassword(pool, email, password) {
// //     const connection = await pool.getConnection();
// //     try {
// //         const [result] = await connection.execute(
// //             "UPDATE users SET password = ? WHERE email = ?",
// //             [password, email]
// //         );
// //         return result;
// //     } catch (error) {
// //         console.error("Error updating password:", error);
// //         throw error;
// //     } finally {
// //         connection.release();
// //     }
// // }

// // async function getUserInfo(pool, user_id) {
// //     let connection;

// //     try {
// //         connection = await pool.getConnection();

// //         const [rows] = await connection.execute(
// //             "SELECT * FROM users WHERE user_id = ?",
// //             [user_id]
// //         );

// //         return rows.length > 0 ? rows[0] : null;
// //     } catch (error) {
// //         console.error("Error fetching user info by ID:", error);
// //         return null;
// //     } finally {
// //         if (connection) connection.release();
// //     }
// // }

// // async function uploadUserRequirement(pool, payload) {
// //     const connection = await pool.getConnection();
// //     try {
// //         await connection.beginTransaction();
// //         console.log(payload.role, 'uploadUserRequirement');

// //         switch (payload.role) {
// //             case 'jobseeker':
// //                 await connection.execute(
// //                     `UPDATE jobseeker SET 
// //                         full_name = ?, 
// //                         date_of_birth = ?, 
// //                         phone = ?, 
// //                         gender = ?, 
// //                         present_address = ?, 
// //                         permanent_address = ?, 
// //                         education = ?, 
// //                         skills = ?, 
// //                         government_id = ?, 
// //                         selfie_with_id = ?, 
// //                         nbi_barangay_clearance = ?
// //                     WHERE jobseeker_id = ?`,
// //                     [
// //                         payload.full_name,
// //                         payload.date_of_birth,
// //                         payload.phone,
// //                         payload.gender,
// //                         payload.present_address,
// //                         payload.permanent_address,
// //                         payload.education,
// //                         payload.skills,
// //                         payload.government_id,
// //                         payload.selfie_with_id,
// //                         payload.nbi_barangay_clearance,
// //                         payload.user_id,
// //                     ]
// //                 );
// //                 break;

// //             case 'individual-employer':
// //                 await connection.execute(
// //                     `UPDATE individual_employer SET 
// //                         full_name = ?, 
// //                         date_of_birth = ?, 
// //                         phone = ?, 
// //                         gender = ?, 
// //                         present_address = ?, 
// //                         permanent_address = ?, 
// //                         government_id = ?, 
// //                         selfie_with_id = ?, 
// //                         nbi_barangay_clearance = ?
// //                     WHERE individual_employer_id = ?`,
// //                     [
// //                         payload.full_name,
// //                         payload.date_of_birth,
// //                         payload.phone,
// //                         payload.gender,
// //                         payload.present_address,
// //                         payload.permanent_address,
// //                         payload.government_id,
// //                         payload.selfie_with_id,
// //                         payload.nbi_barangay_clearance,
// //                         payload.user_id,
// //                     ]
// //                 );
// //                 break;

// //             case 'business-employer':
// //                 await connection.execute(
// //                     `UPDATE business_employer SET 
// //                         business_name = ?, 
// //                         business_address = ?, 
// //                         industry = ?, 
// //                         business_size = ?, 
// //                         authorized_person = ?, 
// //                         authorized_person_id = ?, 
// //                         business_permit_BIR = ?, 
// //                         DTI = ?, 
// //                         business_establishment = ?
// //                     WHERE business_employer_id = ?`,
// //                     [
// //                         payload.business_name,
// //                         payload.business_address,
// //                         payload.industry,
// //                         payload.business_size,
// //                         payload.authorized_person,
// //                         payload.authorized_person_id,
// //                         payload.business_permit_BIR,
// //                         payload.DTI,
// //                         payload.business_establishment,
// //                         payload.user_id,
// //                     ]
// //                 );
// //                 break;

// //             case 'manpower-provider':
// //                 await connection.execute(
// //                     `UPDATE manpower_provider SET 
// //                         agency_name = ?, 
// //                         agency_address = ?, 
// //                         agency_services = ?, 
// //                         agency_authorized_person = ?, 
// //                         dole_registration_number = ?, 
// //                         mayors_permit = ?, 
// //                         agency_certificate = ?, 
// //                         authorized_person_id = ?
// //                     WHERE manpower_provider_id = ?`,
// //                     [
// //                         payload.agency_name,
// //                         payload.agency_address,
// //                         payload.agency_services,
// //                         payload.agency_authorized_person,
// //                         payload.dole_registration_number,
// //                         payload.mayors_permit,
// //                         payload.agency_certificate,
// //                         payload.authorized_person_id,
// //                         payload.user_id,
// //                     ]
// //                 );
// //                 break;

// //             default:
// //                 throw new Error("Unknown role during requirement upload");
// //         }

// //         // ✅ Update user status with logic for rejected/submitted/verified
// //         await connection.execute(
// //             `UPDATE users 
// //              SET 
// //                 is_submitted = TRUE, 
// //                 is_verified = FALSE, 
// //                 is_rejected = CASE 
// //                     WHEN is_rejected = TRUE THEN FALSE 
// //                     ELSE is_rejected 
// //                 END 
// //              WHERE user_id = ?`,
// //             [payload.user_id]
// //         );

// //         await connection.commit();
// //     } catch (error) {
// //         await connection.rollback();
// //         throw error;
// //     } finally {
// //         connection.release();
// //     }
// // }








// // Fetch for admin 
// async function fetchAllUser(pool) {
//     const connection = await pool.getConnection();
//     try {
//         const [users] = await connection.execute(`
//       SELECT 
//         u.user_id, u.role, u.email, u.is_verified, u.is_registered, u.is_submitted,
//         u.is_rejected, u.is_subscribed, u.subscription_start, u.subscription_end,
//         u.account_status, u.status_reason, u.status_updated_at, u.created_at,

//         -- Jobseeker fields
//         js.full_name AS js_full_name, js.date_of_birth AS js_dob, js.phone AS js_phone,
//         js.gender AS js_gender, js.present_address AS js_present_address,
//         js.permanent_address AS js_permanent_address, js.education, js.skills,
//         js.government_id AS js_government_id, js.selfie_with_id AS js_selfie_with_id,
//         js.nbi_barangay_clearance AS js_nbi_barangay_clearance,

//         -- Individual Employer fields
//         ie.full_name AS ie_full_name, ie.date_of_birth AS ie_dob, ie.phone AS ie_phone,
//         ie.gender AS ie_gender, ie.present_address AS ie_present_address,
//         ie.permanent_address AS ie_permanent_address,
//         ie.government_id AS ie_government_id, ie.selfie_with_id AS ie_selfie_with_id,
//         ie.nbi_barangay_clearance AS ie_nbi_barangay_clearance,

//         -- Business Employer fields
//         be.business_name, be.business_address, be.industry, be.business_size,
//         be.authorized_person, be.authorized_person_id,
//         be.business_permit_BIR, be.DTI, be.business_establishment,

//         -- Manpower Provider fields
//         mp.agency_name, mp.agency_address, mp.agency_services, mp.agency_authorized_person,
//         mp.dole_registration_number, mp.mayors_permit, mp.agency_certificate,
//         mp.authorized_person_id AS mp_authorized_person_id

//       FROM users u
//       LEFT JOIN jobseeker js ON u.user_id = js.jobseeker_id AND u.role = 'jobseeker'
//       LEFT JOIN individual_employer ie ON u.user_id = ie.individual_employer_id AND u.role = 'individual-employer'
//       LEFT JOIN business_employer be ON u.user_id = be.business_employer_id AND u.role = 'business-employer'
//       LEFT JOIN manpower_provider mp ON u.user_id = mp.manpower_provider_id AND u.role = 'manpower-provider'
      
//       WHERE u.role IN ('jobseeker', 'business-employer', 'individual-employer', 'manpower-provider')
//       ORDER BY u.created_at DESC
//     `);
//         return users;
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         throw error;
//     } finally {
//         connection.release();
//     }
// }







// module.exports = {
//     // findUsersEmail,
//     // createUsers,
//     // updateUserPassword,
//     // uploadUserRequirement,
//     // getUserInfo,
//     fetchAllUser,
//     // markRegistered
// };