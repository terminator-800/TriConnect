require('dotenv').config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { findManpowerProviderEmail, createManpowerProvider } = require("../service/ManpowerProviderQuery");

const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Account creation failed: Missing email or password",
        });
    }

    try {
        const existingProvider = await findManpowerProviderEmail(email);
        if (existingProvider) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const verificationLink = `http://localhost:${process.env.PORT}/register/manpowerProvider/verify?token=${token}`;

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
        const existingProvider = await findManpowerProviderEmail(email);
        if (existingProvider) {
            return res.send("Account already verified or exists.");
        }
        await createManpowerProvider(email, password);
        console.log("Manpower provider account created successfully!");
        res.send("Email verified and account created successfully!");
    } catch (err) {
        res.status(400).send("Invalid or expired verification link.");
    }
}

module.exports = { register, verifyEmail };