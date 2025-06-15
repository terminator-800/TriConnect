require('dotenv').config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { createManpowerProvider, uploadManpowerProviderRequirement } = require("../service/ManpowerProviderQuery");
const { findUsersEmail, createUsers, getManpowerProviderInfo, uploadUserRequirement } = require("../service/UsersQuery");

const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Account creation failed: Missing email or password",
        });
    }

    try {
        const existingProvider = await findUsersEmail(email);
        if (existingProvider) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const verificationLink = `http://localhost:${process.env.PORT}/register/manpower-provider/verify?token=${token}`;

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
            subject: "Verify your manpower provider email",
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
        const role = "manpower_provider";
        const createdUser = await createUsers(email, password, role);

        if (!createdUser || !createdUser.user_id) {
            return res.status(500).send("Failed to create user account.");
        }

        const user_id = createdUser.user_id;
        await createManpowerProvider(user_id, email, password, role);
        console.log("Business employer account created successfully!");
        res.send("Email verified and account created successfully!");
    } catch (err) {
        console.error("Verification error:", err);
        res.status(400).send("Invalid or expired verification link.");
    }
}

const getManpowerProviderProfile = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;
        const role = decoded.role;

        if (role !== 'manpower_provider') {
            return res.status(403).json({ error: 'Forbidden: Not a manpower provider' });
        }

        const manpowerProviderProfile = await getManpowerProviderInfo(user_id);

        if (!manpowerProviderProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.status(200).json(manpowerProviderProfile);
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
            agency_name,
            agency_address,
            agency_services,
            agency_authorized_person
        } = req.body;

        const dole_registration_number = req.files?.dole_registration_number?.[0]?.filename || null;
        const mayors_permit            = req.files?.mayors_permit?.[0]?.filename || null;
        const agency_certificate       = req.files?.agency_certificate?.[0]?.filename || null;
        const authorized_person_id     = req.files?.authorized_person_id?.[0]?.filename || null;

        const payload = {
            user_id,
            agency_name,
            agency_address,
            agency_services,
            agency_authorized_person,
            dole_registration_number,
            mayors_permit,
            agency_certificate,
            authorized_person_id
        };

        await uploadManpowerProviderRequirement(payload);
        await uploadUserRequirement(payload);

        return res.status(200).json({
            message: "Manpower provider requirements uploaded successfully"
        });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(401).json({
            message: "Unauthorized or invalid token",
            error: error.message
        });
    }
};

module.exports = { register, verifyEmail, getManpowerProviderProfile, uploadRequirements };