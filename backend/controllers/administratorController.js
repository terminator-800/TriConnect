require('dotenv').config();
const { ROLE } = require("../utils/roles")
const pool = require("../config/DatabaseConnection");
const { fetchAllUser, getUserInfo } = require("../service/usersQuery");
const { getPendingJobPosts } = require("../service/jobPostQuery")
const { format } = require('date-fns');

const {
    findOrCreateAdmin,
    rejectUsers,
    verifyUsers,
    rejectJobPostIfExists,
    approveJobPostIfExists,
    getSubmittedUsers,
    getUserFeedbacks
} = require("../service/administratorQuery");

const {
    fetchProofFiles,
    deleteProofRecords,
    deleteReportRecord,
    deleteFiles,
    deleteReportFolder
} = require("../helpers/dismiss-report-helper")

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dbPromise = require("../config/DatabaseConnection")

const {
    validateUserId,
    validateAdminRole,
    restrictUserInDB
} = require('../helpers/restrict-user-helper');

// async function createAdminIfNotExists() {
//     const adminEmail = process.env.ADMIN_EMAIL;
//     const adminPassword = process.env.ADMIN_PASSWORD;
//     const hashedPassword = await bcrypt.hash(adminPassword, 10);

//     try {
//         const result = await findOrCreateAdmin(pool, { email: adminEmail, hashedPassword });

//         if (result.alreadyExists) {
//             console.log("✅ Admin account already exists.");
//         } else {
//             console.log("✅ Admin account created.");
//         }
//     } catch (error) {
//         console.error("❌ Error creating admin:", error);
//     }
// }

// const submittedUsers = async (req, res) => {

//     try {
//         if (req.user.role !== 'administrator') {
//             return res.status(403).json({ error: 'Forbidden: Admins only.' });
//         }
//         const users = await getSubmittedUsers(pool);
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch submitted users' });
//     }
// };

// const fetchUser = async (req, res) => {
//     try {
//         const users = await fetchAllUser(pool);
//         res.status(200).json(users);
//     } catch (error) {
//         console.error("Failed to fetch users:", error);
//         res.status(500).json({ message: "Failed to fetch users" });
//     }
// };

// const pendingJobPosts = async (req, res) => {
//     try {
//         const jobposts = await getPendingJobPosts(pool);

//         res.status(200).json(jobposts);
//     } catch (error) {
//         console.error("Failed to fetch job posts:", error);
//         res.status(500).json({ message: "Failed to fetch job posts" });
//     }
// };

// const verifyUser = async (req, res) => {
//     const { user_id } = req.params;

//     try {
//         const user = await getUserInfo(pool, user_id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         const userRole = user.role;

//         await verifyUsers(pool, user_id);

//         res.json({ success: true, message: `User verified successfully (${userRole}).` });

//     } catch (error) {
//         console.error('Error verifying user:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// };

// const rejectUser = async (req, res) => {
//     const { user_id } = req.params;
//     console.log(user_id);

//     try {
//         const user = await getUserInfo(pool, user_id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         await rejectUsers(pool, user_id);

//         res.json({ success: true, message: `User rejected successfully (${user_id}).` });

//     } catch (error) {
//         console.error('Error rejecting user:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// };


// const rejectJobpost = async (req, res) => {
//     const jobPostId = req.params.job_post_id;

//     try {
//         const result = await rejectJobPostIfExists(pool, jobPostId);

//         if (!result.success) {
//             return res.status(404).json({ error: result.message });
//         }

//         return res.status(200).json({ message: result.message });
//     } catch (error) {
//         console.error('Error rejecting jobpost:', error);
//         return res.status(500).json({ error: 'Internal server error.' });
//     }
// };

// const approveJobPost = async (req, res) => {
//     const jobPostId = req.params.job_post_id;

//     try {
//         const result = await approveJobPostIfExists(pool, jobPostId);

//         if (!result.success) {
//             return res.status(404).json({ message: result.message });
//         }

//         return res.status(200).json({ message: result.message });
//     } catch (error) {
//         console.error("Error approving jobpost:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };

// const verifiedUsers = async (req, res) => {
//     try {
//         const { role } = req.user;

//         if (role !== ROLE.ADMINISTRATOR) {
//             return res.status(403).json({ message: 'Forbidden: Administrator only' });
//         }

//         // Query to fetch all verified users and join their role-based data
//         const [rows] = await pool.query(`
//       SELECT 
//         u.user_id, u.role, u.email, u.verified_at,

//         -- Jobseeker fields
//         js.full_name AS full_name, js.date_of_birth, js.phone, js.gender,
//         js.present_address, js.permanent_address, js.education, js.skills,
//         js.government_id, js.selfie_with_id, js.nbi_barangay_clearance,

//         -- Individual employer fields
//         ie.full_name AS individual_full_name, ie.date_of_birth AS individual_dob,
//         ie.phone AS individual_phone, ie.gender AS individual_gender,
//         ie.present_address AS individual_present_address,
//         ie.permanent_address AS individual_permanent_address,
//         ie.government_id AS individual_government_id,
//         ie.selfie_with_id AS individual_selfie_with_id,
//         ie.nbi_barangay_clearance AS individual_clearance,

//         -- Business employer fields
//         be.business_name, be.business_address, be.industry, be.business_size,
//         be.authorized_person, be.authorized_person_id,
//         be.business_permit_BIR, be.DTI, be.business_establishment,

//         -- Manpower provider fields
//         mp.agency_name, mp.agency_address, mp.agency_services,
//         mp.agency_authorized_person, mp.authorized_person_id AS mp_authorized_person_id,
//         mp.dole_registration_number, mp.mayors_permit, mp.agency_certificate

//       FROM users u
//       LEFT JOIN jobseeker js ON u.user_id = js.jobseeker_id
//       LEFT JOIN individual_employer ie ON u.user_id = ie.individual_employer_id
//       LEFT JOIN business_employer be ON u.user_id = be.business_employer_id
//       LEFT JOIN manpower_provider mp ON u.user_id = mp.manpower_provider_id
//       WHERE u.is_verified = 1 AND u.role != ?
//     `, [ROLE.ADMINISTRATOR]);

//         // Post-processing: Flatten the correct fields depending on role
//         const formatted = rows.map(user => {
//             const base = {
//                 user_id: user.user_id,
//                 role: user.role,
//                 email: user.email,
//                 verified_at: user.verified_at ? format(new Date(user.verified_at), 'MMMM dd, yy \'at\' hh:mm a') : null
//             };

//             if (user.role === ROLE.JOBSEEKER) {
//                 return {
//                     ...base,
//                     full_name: user.full_name,
//                     date_of_birth: user.date_of_birth,
//                     phone: user.phone,
//                     gender: user.gender,
//                     present_address: user.present_address,
//                     permanent_address: user.permanent_address,
//                     education: user.education,
//                     skills: user.skills,
//                     government_id: user.government_id,
//                     selfie_with_id: user.selfie_with_id,
//                     nbi_barangay_clearance: user.nbi_barangay_clearance
//                 };
//             }

//             if (user.role === ROLE.INDIVIDUAL_EMPLOYER) {
//                 return {
//                     ...base,
//                     full_name: user.individual_full_name,
//                     date_of_birth: user.individual_dob,
//                     phone: user.individual_phone,
//                     gender: user.individual_gender,
//                     present_address: user.individual_present_address,
//                     permanent_address: user.individual_present_address,
//                     government_id: user.individual_government_id,
//                     selfie_with_id: user.individual_selfie_with_id,
//                     nbi_barangay_clearance: user.individual_clearance
//                 };
//             }

//             if (user.role === ROLE.BUSINESS_EMPLOYER) {
//                 return {
//                     ...base,
//                     business_name: user.business_name,
//                     business_address: user.business_address,
//                     industry: user.industry,
//                     business_size: user.business_size,
//                     authorized_person: user.authorized_person,
//                     authorized_person_id: user.authorized_person_id,
//                     business_permit_BIR: user.business_permit_BIR,
//                     DTI: user.DTI,
//                     business_establishment: user.business_establishment
//                 };
//             }

//             if (user.role === ROLE.MANPOWER_PROVIDER) {
//                 return {
//                     ...base,
//                     agency_name: user.agency_name,
//                     agency_address: user.agency_address,
//                     agency_services: user.agency_services,
//                     agency_authorized_person: user.agency_authorized_person,
//                     authorized_person_id: user.mp_authorized_person_id,
//                     dole_registration_number: user.dole_registration_number,
//                     mayors_permit: user.mayors_permit,
//                     agency_certificate: user.agency_certificate
//                 };
//             }

//             return base;
//         });

//         res.json(formatted);
//     } catch (error) {
//         console.error('Error getting verified users:', error);
//         return res.status(500).json({ message: 'Failed to get verified users.' });
//     }
// };

// const verifiedJobPosts = async (req, res) => {
//     try {
//         const [rows] = await pool.query(
//             `SELECT 
//                 jp.job_post_id,
//                 jp.user_id,
//                 jp.role,
//                 jp.job_title,
//                 jp.job_type,
//                 jp.salary_range,
//                 jp.location,
//                 jp.required_skill,
//                 jp.job_description,
//                 jp.approved_at,
//                 u.email,
//                 u.verified_at,

//                 js.full_name AS full_name,
//                 js.date_of_birth,
//                 js.phone,
//                 js.gender,
//                 js.present_address,
//                 js.permanent_address,
//                 js.education,
//                 js.skills,
//                 js.government_id,
//                 js.selfie_with_id,
//                 js.nbi_barangay_clearance,

//                 ie.full_name AS individual_full_name,
//                 ie.date_of_birth AS individual_dob,
//                 ie.phone AS individual_phone,
//                 ie.gender AS individual_gender,
//                 ie.present_address AS individual_present_address,
//                 ie.permanent_address AS individual_permanent_address,
//                 ie.government_id AS individual_government_id,
//                 ie.selfie_with_id AS individual_selfie_with_id,
//                 ie.nbi_barangay_clearance AS individual_clearance,

//                 be.business_name,
//                 be.business_address,
//                 be.industry,
//                 be.business_size,
//                 be.authorized_person,
//                 be.authorized_person_id,
//                 be.business_permit_BIR,
//                 be.DTI,
//                 be.business_establishment,

//                 mp.agency_name,
//                 mp.agency_address,
//                 mp.agency_services,
//                 mp.agency_authorized_person,
//                 mp.authorized_person_id AS mp_authorized_person_id,
//                 mp.dole_registration_number,
//                 mp.mayors_permit,
//                 mp.agency_certificate

//                 FROM job_post jp
//                 LEFT JOIN users u ON jp.user_id = u.user_id
//                 LEFT JOIN jobseeker js ON jp.user_id = js.jobseeker_id
//                 LEFT JOIN individual_employer ie ON jp.user_id = ie.individual_employer_id
//                 LEFT JOIN business_employer be ON jp.user_id = be.business_employer_id
//                 LEFT JOIN manpower_provider mp ON jp.user_id = mp.manpower_provider_id
//                 WHERE jp.is_verified_jobpost = 1`
//         );

//         const formatted = rows.map(user => {
//             const base = {
//                 user_id: user.user_id,
//                 role: user.role,
//                 email: user.email,
//                 job_post_id: user.job_post_id,
//                 job_title: user.job_title,
//                 job_type: user.job_type,
//                 salary_range: user.salary_range,
//                 location: user.location,
//                 required_skill: user.required_skill,
//                 job_description: user.job_description,
//                 approved_at: user.approved_at ? format(new Date(user.verified_at), 'MMMM dd, yyy \'at\' hh:mm a') : null,
//                 verified_at: user.verified_at ? format(new Date(user.verified_at), 'MMMM dd, yyy \'at\' hh:mm a') : null,
//             };

//             switch (user.role) {
//                 case ROLE.JOBSEEKER:
//                     return {
//                         ...base,
//                         full_name: user.full_name,
//                         date_of_birth: user.date_of_birth,
//                         phone: user.phone,
//                         gender: user.gender,
//                         present_address: user.present_address,
//                         permanent_address: user.permanent_address,
//                         education: user.education,
//                         skills: user.skills,
//                         government_id: user.government_id,
//                         selfie_with_id: user.selfie_with_id,
//                         nbi_barangay_clearance: user.nbi_barangay_clearance
//                     };

//                 case ROLE.INDIVIDUAL_EMPLOYER:
//                     return {
//                         ...base,
//                         full_name: user.individual_full_name,
//                         date_of_birth: user.individual_dob,
//                         phone: user.individual_phone,
//                         gender: user.individual_gender,
//                         present_address: user.individual_present_address,
//                         permanent_address: user.individual_present_address,
//                         government_id: user.individual_government_id,
//                         selfie_with_id: user.individual_selfie_with_id,
//                         nbi_barangay_clearance: user.individual_clearance
//                     };

//                 case ROLE.BUSINESS_EMPLOYER:
//                     return {
//                         ...base,
//                         business_name: user.business_name,
//                         business_address: user.business_address,
//                         industry: user.industry,
//                         business_size: user.business_size,
//                         authorized_person: user.authorized_person,
//                         authorized_person_id: user.authorized_person_id,
//                         business_permit_BIR: user.business_permit_BIR,
//                         DTI: user.DTI,
//                         business_establishment: user.business_establishment
//                     };

//                 case ROLE.MANPOWER_PROVIDER:
//                     return {
//                         ...base,
//                         agency_name: user.agency_name,
//                         agency_address: user.agency_address,
//                         agency_services: user.agency_services,
//                         agency_authorized_person: user.agency_authorized_person,
//                         authorized_person_id: user.mp_authorized_person_id,
//                         dole_registration_number: user.dole_registration_number,
//                         mayors_permit: user.mayors_permit,
//                         agency_certificate: user.agency_certificate
//                     };

//                 default:
//                     return base;
//             }
//         });

//         res.json(formatted);
//     } catch (error) {
//         console.error('Error getting verified job posts:', error);
//         res.status(500).json({ message: 'Failed to get verified job posts.' });
//     }
// };

// const allReportedUsers = async () => {
//     let connection;

//     try {
//         connection = await pool.getConnection();

//         const [rows] = await connection.query(`
//       SELECT 
//         r.report_id,
//         r.reason,
//         r.message,
//         r.created_at,
//         r.reported_by AS reporter_id,
//         r.reported_user_id,
//         r.status AS report_status,

//         ru.role AS reported_user_role,
//         ru.account_status AS reported_user_status,
//         rr.role AS reporter_role,

//         -- Reporter Names
//         COALESCE(js1.full_name, ie1.full_name, mp1.agency_authorized_person, be1.authorized_person) AS reporter_name,
        
//         -- Reported User Names
//         COALESCE(js2.full_name, ie2.full_name, mp2.agency_authorized_person, be2.authorized_person) AS reported_user_name

//       FROM reports r

//       -- Reporter
//       LEFT JOIN users rr ON r.reported_by = rr.user_id
//       LEFT JOIN jobseeker js1 ON rr.user_id = js1.jobseeker_id
//       LEFT JOIN individual_employer ie1 ON rr.user_id = ie1.individual_employer_id
//       LEFT JOIN manpower_provider mp1 ON rr.user_id = mp1.manpower_provider_id
//       LEFT JOIN business_employer be1 ON rr.user_id = be1.business_employer_id

//       -- Reported User
//       LEFT JOIN users ru ON r.reported_user_id = ru.user_id
//       LEFT JOIN jobseeker js2 ON ru.user_id = js2.jobseeker_id
//       LEFT JOIN individual_employer ie2 ON ru.user_id = ie2.individual_employer_id
//       LEFT JOIN manpower_provider mp2 ON ru.user_id = mp2.manpower_provider_id
//       LEFT JOIN business_employer be2 ON ru.user_id = be2.business_employer_id

//       ORDER BY r.created_at DESC
//     `);

//         const formattedReports = await Promise.all(rows.map(async (row) => {
//             const [proofs] = await connection.query(`
//         SELECT 
//           proof_id, 
//           file_url, 
//           file_type, 
//           uploaded_at 
//         FROM report_proofs 
//         WHERE report_id = ?
//       `, [row.report_id]);

//             return {
//                 report_id: row.report_id,
//                 reason: row.reason,
//                 message: row.message,
//                 created_at: format(new Date(row.created_at), "MMMM d, yyyy 'at' hh:mm a"),
//                 can_view: true,
//                 reporter: {
//                     user_id: row.reporter_id,
//                     name: row.reporter_name,
//                     role: row.reporter_role
//                 },
//                 reported_user: {
//                     user_id: row.reported_user_id,
//                     name: row.reported_user_name,
//                     role: row.reported_user_role,
//                     status: row.reported_user_status
//                 },
//                 proofs: proofs.map(proof => ({
//                     proof_id: proof.proof_id,
//                     file_url: proof.file_url,
//                     file_type: proof.file_type,
//                     uploaded_at: format(new Date(proof.uploaded_at), "MMMM d, yyyy 'at' hh:mm a")
//                 }))
//             };
//         }));

        
//         return formattedReports;

//     } catch (error) {
//         console.error('Error fetching reported users:', error);
//         throw error;
//     } finally {
//         if (connection) connection.release();
//     }
// };

// const restrictUser = async (req, res) => {
//     let connection;

//     try {
//         const { user_id, reason } = req.body;

//         // Step 1: Validate inputs and permissions
//         validateUserId(user_id);
//         validateAdminRole(req.user);

//         // Step 2: Get a pooled connection
//         connection = await pool.getConnection();
//         await connection.beginTransaction();

//         // Step 3: Perform DB update
//         await restrictUserInDB(connection, user_id, reason);

//         // Step 4: Commit and release
//         await connection.commit();
//         connection.release();

//         res.json({
//             message: 'User restricted successfully',
//             user_id,
//             new_status: 'restricted'
//         });
//     } catch (error) {
//         console.error('Error restricting user:', error);

//         // Rollback if connection was established
//         if (connection) {
//             await connection.rollback();
//             connection.release();
//         }

//         res.status(error.status || 500).json({
//             error: error.message || 'Failed to restrict user'
//         });
//     }
// };

// const dismissReport = async (req, res) => {
//     let connection;

//     try {
//         const { report_id } = req.body;

//         if (!report_id) {
//             return res.status(400).json({ error: 'Report ID is required' });
//         }

//         if (req.user?.role !== 'administrator') {
//             return res.status(403).json({ error: 'Access denied: Administrators only' });
//         }

//         // Get pooled connection
//         connection = await pool.getConnection();
//         await connection.beginTransaction();

//         const proofs = await fetchProofFiles(connection, report_id);

//         await deleteProofRecords(connection, report_id);
//         const deleted = await deleteReportRecord(connection, report_id);

//         if (!deleted) {
//             await connection.rollback();
//             connection.release();
//             return res.status(404).json({ error: 'Report not found or already dismissed' });
//         }

//         await connection.commit();
//         connection.release();

//         // File deletion can happen after DB commit
//         deleteFiles(proofs);
//         deleteReportFolder(report_id);

//         res.status(200).json({ message: 'Report dismissed and files deleted', report_id });
//     } catch (error) {
//         console.error('Error dismissing report:', error);

//         if (connection) {
//             await connection.rollback();
//             connection.release();
//         }

//         res.status(500).json({ error: 'Failed to dismiss report' });
//     }
// };


// const userFeedbacks = async (req, res) => {
//     let connection;
//     try {
//         if (req.user?.role !== "administrator") {
//             return res.status(403).json({ message: "Forbidden: Admins only" });
//         }

//         connection = await pool.getConnection();
//         const feedbacks = await getUserFeedbacks(connection);

//         return res.status(200).json(feedbacks);
//     } catch (error) {
//         console.error("Error fetching user feedback:", error);
//         return res.status(500).json({ message: "Failed to fetch user feedback." });
//     }
// };

module.exports = {
    // createAdminIfNotExists,
    // submittedUsers,
    // fetchUser,
    // verifyUser,
    // rejectUser,
    // pendingJobPosts,
    // rejectJobpost,
    // approveJobPost,
    // verifiedUsers,
    // verifiedJobPosts,
    // allReportedUsers,
    // restrictUser,
    // dismissReport,
    // userFeedbacks
}
