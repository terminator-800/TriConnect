require('dotenv').config();
const { fetchAllUser, verifyUsers, getUserInfo, rejectUsers } = require("../service/UsersQuery");
const { verifyJobseeker, rejectJobseeker } = require("../service/JobseekerQuery")
const { verifyBusinessEmployer, rejectBusinessEmployer } = require("../service/BusinessEmployerQuery")
const { verifyIndividualEmployer, rejectIndividualEmployer } = require("../service/IndividualEmployerQuery")
const { verifyManpowerProvider, rejectManpowerProvider } = require("../service/ManpowerProviderQuery")
const { getAllJobPosts } = require("../service/JobPostQuery")
const { findOrCreateAdmin, rejectJobPostIfExists, approveJobPostIfExists } = require("../service/administratorQuery");
const bcrypt = require('bcrypt');

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

const fetchUser = async (req, res) => {
    try {
        const users = await fetchAllUser();
        res.status(200).json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};


const fetchJobPost = async (req, res) => {
    try {
        const jobposts = await getAllJobPosts();
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

        switch (userRole) {
            case 'jobseeker':
                await verifyJobseeker(user_id);
                break;
            case 'business_employer':
                await verifyBusinessEmployer(user_id);
                break;
            case 'individual_employer':
                await verifyIndividualEmployer(user_id);
                break;
            case 'manpower_provider':
                await verifyManpowerProvider(user_id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid user role.' });
        }

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

        const userRole = user.role;

        switch (userRole) {
            case 'jobseeker':
                await rejectJobseeker(user_id);
                break;
            case 'business_employer':
                await rejectBusinessEmployer(user_id);
                break;
            case 'individual_employer':
                await rejectIndividualEmployer(user_id);
                break;
            case 'manpower_provider':
                await rejectManpowerProvider(user_id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid user role.' });
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


module.exports = { createAdminIfNotExists, fetchUser, verifyUser, verifyManpowerProvider, rejectUser, fetchJobPost, rejectJobpost, approveJobpost }
