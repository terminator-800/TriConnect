require('dotenv').config();
const { fetchAllUser, verifyUsers, getUserInfo, rejectUsers } = require("../service/UsersQuery");
const { verifyJobseeker, rejectJobseeker } = require("../service/JobseekerQuery")
const { verifyBusinessEmployer, rejectBusinessEmployer } = require("../service/BusinessEmployerQuery")
const { verifyIndividualEmployer, rejectIndividualEmployer } = require("../service/IndividualEmployerQuery")
const { verifyManpowerProvider, rejectManpowerProvider } = require("../service/ManpowerProviderQuery")
const { getAllJobPosts } = require("../service/JobPostQuery")
const dbPromise = require("../config/DatabaseConnection");
const bcrypt = require('bcrypt');

async function createAdminIfNotExists() {
    const db = await dbPromise;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    try {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ? AND role = 'admin'",
            [adminEmail]
        );

        if (rows.length === 0) {
            await db.execute(
                "INSERT INTO users (role, email, password, is_verified) VALUES (?, ?, ?, ?)",
                ['admin', adminEmail, hashedPassword, 1]
            );
        } else {
            console.log("✅ Admin account already exists.");
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
    const db = await dbPromise;
    const jobPostId = req.params.job_post_id;
    console.log("this is line 112: ", jobPostId);
    
    try{
        const [jobPostRows] = await db.query('SELECT * FROM job_post WHERE job_post_id = ?', [jobPostId])

        if(jobPostRows.length === 0){
            return res.status(404).json({error: 'Jobpost not found.'})
        }

        await db.query(`
            UPDATE job_post 
            SET 
                status = 'rejected', 
                is_verified_jobpost = FALSE
            WHERE job_post_id = ?
            `, [jobPostId]);

        return res.status(200).json({ message: 'Jobpost rejected successfully.'})
    }catch (error){
        console.error('Error rejecting jobpost:', error);
        return res.status(500).json({ error: 'Internal server error.'})
    }
}

const approveJobpost = async (req, res) => {
    const db = await dbPromise;
    const jobPostId = req.params.job_post_id;

     try{
    const [jobPostRows] = await db.query('SELECT * FROM job_post WHERE job_post_id = ?', [jobPostId])

    if(jobPostRows.length === 0){
        return res.status(404).json({ message: 'Jobpost not found'})
    }

    await db.query(`
        UPDATE job_post
        SET
        status = 'approved',
        rejection_reason = NULL,
        approved_at = NOW(),
        is_verified_jobpost = TRUE
        WHERE job_post_id = ?`, [jobPostId])

        return res.status(200).json({ message: 'Jobpost approved successfully.'})
      
     } catch (error){
        console.error("Error approving jobpost", error)
        return res.status(500).json({ error: 'Internal server error'})
     }
    
}


module.exports = { createAdminIfNotExists, fetchUser, verifyUser, verifyManpowerProvider, rejectUser, fetchJobPost, rejectJobpost, approveJobpost }
