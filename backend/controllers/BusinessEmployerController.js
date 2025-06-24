require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dbPromise = require("../config/DatabaseConnection");
const { findUsersEmail, createUsers, uploadUserRequirement, getUserInfo } = require("../service/UsersQuery");
const { createBusinessEmployer, uploadBusinessEmployerRequirement } = require("../service/BusinessEmployerQuery")
const { getUserSubscription,
    expireUserSubscription,
    archiveOldJobPosts,
    getJobPostCountThisMonth,
    insertJobPost } = require("../service/JobPostQuery");

const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Account creation failed: Missing email or password",
        });
    }
    try {
        const existingEmployer = await findUsersEmail(email);
        if (existingEmployer) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const verificationLink = `http://localhost:${process.env.PORT}/register/employer/business/verify?token=${token}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your business employer email",
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email and complete registration.</p>`,
        });
        return res.status(201).json({
            message: "Verification email sent. Please check your inbox to complete registration.",
        });
    } catch (error) {
        console.error("Error sending verification email:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, password } = decoded;
        const role = "business_employer";

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await createUsers(email, hashedPassword, role);
        if (!createdUser || !createdUser.user_id) {
            return res.status(500).send("Failed to create user account.");
        }

        const user_id = createdUser.user_id;

        await createBusinessEmployer(user_id, role, email, hashedPassword);

        console.log("Business employer account created successfully!");
        res.send("Email verified and account created successfully!");
    } catch (err) {
        console.error("Verification error:", err);
        res.status(400).send("Invalid or expired verification link.");
    }
};


const createJobPost = async (req, res) => {
    const {
        job_title,
        job_type,
        salary_range,
        location,
        required_skill,
        job_description,
    } = req.body;

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Token not provided." });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Unauthorized: Invalid token." });
        }

        const { user_id, role } = decoded;
        
        if (role !== "business_employer") {
            return res.status(403).json({ error: "Forbidden: Only business employers can create job posts." });
        }

        if (!job_title || !job_type || !salary_range || !location || !job_description || !required_skill) {
            return res.status(400).json({ error: "All required fields must be filled out." });
        }

        const validJobTypes = ["Full-time", "Part-time", "Contract"];
        if (!validJobTypes.includes(job_type)) {
            return res.status(400).json({ error: "Invalid job type." });
        }

        const subscription = await getUserSubscription(user_id);
        if (!subscription) {
            return res.status(404).json({ error: "User not found." });
        }

        let { is_subscribed, subscription_end } = subscription;

        if (is_subscribed && new Date(subscription_end) < new Date()) {
            await expireUserSubscription(user_id);
            is_subscribed = 0;
        }

        if (!is_subscribed) {
            await archiveOldJobPosts(user_id);
        }

        const postCount = await getJobPostCountThisMonth(user_id);
        const maxAllowedPosts = is_subscribed ? 10 : 3;

        if (postCount >= maxAllowedPosts) {
            return res.status(403).json({
                error: `You have reached the maximum of ${maxAllowedPosts} job posts this month.` +
                    (is_subscribed ? "" : " Please upgrade your subscription."),
            });
        }

        const job_post_id = await insertJobPost({
            user_id, role, job_title, job_type,
            salary_range, location, required_skill, job_description
        });

        res.status(201).json({
            message: "Job post created successfully!",
            job_post_id,
        });

    } catch (error) {
        console.error("Error creating job post:", error.stack);
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Invalid input data." });
        }
        res.status(500).json({ error: "Failed to create job post." });
    }
};

const getBusinessEmployerProfile = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;
        const role = decoded.role;

        if (role !== 'business_employer') {
            return res.status(403).json({ error: 'Forbidden: Not a business employer' });
        }

        const businessEmployerProfile = await getUserInfo(user_id);
        if (!businessEmployerProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.status(200).json(businessEmployerProfile);
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

const uploadRequirements = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { user_id } = decoded;

        const {
            business_name,
            business_address,
            industry,
            business_size,
            authorized_person
        } = req.body;

        const authorized_person_id = req.files?.authorized_person_id?.[0]?.filename || null;
        const business_permit_BIR = req.files?.business_permit_BIR?.[0]?.filename || null;
        const DTI = req.files?.DTI?.[0]?.filename || null;
        const business_establishment = req.files?.business_establishment?.[0]?.filename || null;

        const payload = {
            user_id,
            business_name,
            business_address,
            industry,
            business_size,
            authorized_person,
            authorized_person_id,
            business_permit_BIR,
            DTI,
            business_establishment
        };

        await uploadBusinessEmployerRequirement(payload);
        await uploadUserRequirement(payload);

        return res.status(200).json({ message: "Business employer requirements uploaded successfully" });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(401).json({
            message: "Unauthorized or invalid token",
            error: error.message
        });
    }
};




module.exports = { register, verifyEmail, createJobPost, getBusinessEmployerProfile, uploadRequirements };
