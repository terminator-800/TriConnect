require('dotenv').config();
const { ROLE } = require("../utils/roles")
const { fetchAllUser, verifyUsers, getUserInfo, rejectUsers } = require("../service/usersQuery");
const { getPendingJobPosts } = require("../service/jobPostQuery")
const {
    findOrCreateAdmin,
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
} = require("../utils/dismissReportHelper")

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dbPromise = require("../config/DatabaseConnection")

const {
    validateUserId,
    validateAdminRole,
    restrictUserInDB
} = require('../utils/restrictHelper');

async function createAdminIfNotExists() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    try {
        const result = await findOrCreateAdmin({ email: adminEmail, hashedPassword });

        if (result.alreadyExists) {
            console.log("✅ Admin account already exists.");
        } else {
            console.log("✅ Admin account created.");
        }
    } catch (error) {
        console.error("❌ Error creating admin:", error);
    }
}

const submittedUsers = async (req, res) => {
    try {
        const users = await getSubmittedUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch submitted users' });
    }
};

const fetchUser = async (req, res) => {
    try {
        const users = await fetchAllUser();
        res.status(200).json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

const pendingJobPosts = async (req, res) => {
    try {
        const jobposts = await getPendingJobPosts();

        res.status(200).json(jobposts);
    } catch (error) {
        console.error("Failed to fetch job posts:", error);
        res.status(500).json({ message: "Failed to fetch job posts" });
    }
};

const verifyUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await getUserInfo(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userRole = user.role;

        await verifyUsers(user_id);

        res.json({ success: true, message: `User verified successfully (${userRole}).` });

    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const rejectUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await getUserInfo(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await rejectUsers(user_id);

        res.json({ success: true, message: `User rejected successfully (${user_id}).` });

    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const rejectJobpost = async (req, res) => {
    const jobPostId = req.params.job_post_id;

    try {
        const result = await rejectJobPostIfExists(jobPostId);

        if (!result.success) {
            return res.status(404).json({ error: result.message });
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error rejecting jobpost:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

const approveJobpost = async (req, res) => {
    const jobPostId = req.params.job_post_id;

    try {
        const result = await approveJobPostIfExists(jobPostId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error approving jobpost:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const verifiedUsers = async (req, res) => {
    const db = await dbPromise;
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        if (decoded.role !== ROLE.ADMINISTRATOR) {
            return res.status(403).json({ message: 'Forbidden: Administrator only' });
        }

        // get verified users
        const [rows] = await db.query(
            `SELECT 
                user_id, role, email, 
                full_name, date_of_birth, phone, gender,
                present_address, permanent_address, education, skills,
                government_id, selfie_with_id, nbi_barangay_clearance,
                business_name, business_address, industry, business_size,
                authorized_person, authorized_person_id, business_permit_BIR, DTI, business_establishment,
                agency_name, agency_address, agency_services, agency_authorized_person,
                dole_registration_number, mayors_permit, agency_certificate,
                verified_at
             FROM users
             WHERE is_verified = 1 AND role != ?`,
            [ROLE.ADMINISTRATOR]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error getting verified users:', error);
        return res.status(500).json({ message: 'Failed to get verified users.' });
    }
};

const verifiedJobPosts = async (req, res) => {
    const db = await dbPromise;
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        if (decoded.role !== ROLE.ADMINISTRATOR) {
            return res.status(403).json({ message: 'Forbidden: Administrator only' });
        }

        const [rows] = await db.query(
            `SELECT 
                jp.job_post_id,
                jp.user_id,
                jp.role,
                jp.job_title,
                jp.job_type,
                jp.salary_range,
                jp.location,
                jp.required_skill,
                jp.job_description,
                jp.approved_at,
                u.business_name,
                u.full_name,
                u.agency_name
             FROM job_post jp
             LEFT JOIN users u ON jp.user_id = u.user_id
             WHERE jp.is_verified_jobpost = 1`
        );

        res.json(rows);
    } catch (error) {
        console.error('Error getting verified job posts:', error);
        return res.status(500).json({ message: 'Failed to get verified job posts.' });
    }
};

const allReportedUsers = async (req, res) => {
    const db = await dbPromise;

    if (req.user?.role !== 'administrator') {
        return res.status(403).json({ error: 'Access denied: Administrator only' });
    }

    try {
        const query = `
      SELECT 
        r.report_id,
        r.reported_user_id,
        ru.role AS reported_role,
        COALESCE(ru.full_name, ru.authorized_person, ru.agency_authorized_person) AS reported_name,
        ru.account_status,

        r.reason,
        r.message,
        r.reported_by,
        r.created_at,

        u.user_id AS reporter_id,
        u.role AS reporter_role,
        COALESCE(u.full_name, u.authorized_person, u.agency_authorized_person) AS reporter_name,

        COALESCE(JSON_ARRAYAGG(
          JSON_OBJECT(
            'proof_id', rp.proof_id,
            'file_url', rp.file_url,
            'file_type', rp.file_type,
            'uploaded_at', rp.uploaded_at
          )
        ), JSON_ARRAY()) AS proofs

      FROM reports r
      JOIN users ru ON r.reported_user_id = ru.user_id
      JOIN users u ON r.reported_by = u.user_id
      LEFT JOIN report_proofs rp ON r.report_id = rp.report_id

      WHERE ru.account_status != 'restricted'

      GROUP BY r.report_id
      ORDER BY r.created_at DESC
    `;

        const [rows] = await db.query(query);

        const formatted = rows.map(row => ({
            report_id: row.report_id,
            reason: row.reason,
            message: row.message,
            created_at: row.created_at,
            canView: true,
            reporter: {
                user_id: row.reporter_id,
                name: row.reporter_name,
                role: row.reporter_role
            },
            reported_user: {
                user_id: row.reported_user_id,
                name: row.reported_name,
                role: row.reported_role
            },
            proofs: Array.isArray(row.proofs)
                ? row.proofs.map(p => ({
                    proof_id: p.proof_id,
                    file_url: p.file_url
                }))
                : []
        }));

        res.status(200).json(formatted);
    } catch (err) {
        console.error('Failed to fetch reported users:', err);
        res.status(500).json({ error: 'Failed to fetch reported users' });
    }
};


const restrictUser = async (req, res) => {
    const db = await dbPromise;

    try {
        const { user_id, reason } = req.body;

        // Step 1: Validate inputs and permissions
        validateUserId(user_id);
        validateAdminRole(req.user);

        // Step 2: Update DB
        await restrictUserInDB(db, user_id, reason);

        // Step 3: Respond
        res.json({
            message: 'User restricted successfully',
            user_id,
            new_status: 'restricted'
        });
    } catch (error) {
        console.error('Error restricting user:', error);

        res.status(error.status || 500).json({
            error: error.message || 'Failed to restrict user'
        });
    }
};

const dismissReport = async (req, res) => {
    try {
        const { report_id } = req.body;

        if (!report_id) {
            return res.status(400).json({ error: 'Report ID is required' });
        }

        if (req.user?.role !== 'administrator') {
            return res.status(403).json({ error: 'Access denied: Administrators only' });
        }

        const db = await dbPromise;

        const proofs = await fetchProofFiles(db, report_id);

        await deleteProofRecords(db, report_id);
        const deleted = await deleteReportRecord(db, report_id);

        if (!deleted) {
            return res.status(404).json({ error: 'Report not found or already dismissed' });
        }

        deleteFiles(proofs);
        deleteReportFolder(report_id);

        res.status(200).json({ message: 'Report dismissed and files deleted', report_id });
    } catch (error) {
        console.error('Error dismissing report:', error);
        res.status(500).json({ error: 'Failed to dismiss report' });
    }
};

const userFeedbacks = async (req, res) => {
  try {
    if (req.user?.role !== "administrator") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const feedbacks = await getUserFeedbacks();
    
    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return res.status(500).json({ message: "Failed to fetch user feedback." });
  }
};

module.exports = {
    createAdminIfNotExists,
    submittedUsers,
    fetchUser,
    verifyUser,
    rejectUser,
    pendingJobPosts,
    rejectJobpost,
    approveJobpost,
    verifiedUsers,
    verifiedJobPosts,
    allReportedUsers,
    restrictUser,
    dismissReport,
    userFeedbacks
}
