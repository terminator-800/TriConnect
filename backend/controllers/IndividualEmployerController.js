require('dotenv').config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { createIndividualEmployer, uploadIndividualEmployerRequirement } = require("../service/IndividualEmployerQuery");
const { findUsersEmail, createUsers, getUserInfo, uploadUserRequirement } = require("../service/UsersQuery");

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
        const verificationLink = `http://localhost:${process.env.PORT}/register/employer/individual/verify?token=${token}`;
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
            subject: "Verify your individual employer email",
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
        const role = "individual_employer";

        const createdUser = await createUsers(email, password, role);
        if (!createdUser || !createdUser.user_id) {
            return res.status(500).send("Failed to create user account.");
        }
        
        const user_id = createdUser.user_id;

        await createIndividualEmployer(user_id, role, email, password);

        console.log("Individual employer account created successfully!");
        res.send("Email verified and account created successfully!");
    } catch (err) {
        console.error("Verification error:", err);
        res.status(400).send("Invalid or expired verification link.");
    }
}

const getIndividualEmployerProfile = async (req, res) => { 
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;
        const role = decoded.role;
        
        if (role !== 'individual_employer') {
            return res.status(403).json({ error: 'Forbidden: Not an individual employer' });
        }

        const individualEmployerProfile = await getUserInfo(user_id);
        if (!individualEmployerProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        return res.status(200).json(individualEmployerProfile);
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const uploadRequirements = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { user_id } = decoded;

        const {
            full_name,
            date_of_birth,
            phone,
            gender,
            present_address,
            permanent_address
        } = req.body;

        const government_id           = req.files?.government_id?.[0]?.filename || null;
        const selfie_with_id          = req.files?.selfie_with_id?.[0]?.filename || null;
        const nbi_barangay_clearance  = req.files?.nbi_barangay_clearance?.[0]?.filename || null;

        const payload = {
            user_id,
            full_name,
            date_of_birth,
            phone,
            gender,
            present_address,
            permanent_address,
            government_id,
            selfie_with_id,
            nbi_barangay_clearance
        };

        await uploadIndividualEmployerRequirement(payload);
        await uploadUserRequirement(payload);

        return res.status(200).json({ message: "Individual employer requirements uploaded successfully" });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(401).json({
            message: "Unauthorized or invalid token",
            error: error.message
        });
    }
};

module.exports = { register, verifyEmail, getIndividualEmployerProfile, uploadRequirements };
