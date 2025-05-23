require('dotenv').config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { findBusinessEmployerUsername, createBusinessEmployer } = require("../service/BusinessEmployerQuery");

const register = async (req, res) => {
    const { username, password } = req.body;
    console.log(username + password);
    
    if (!username || !password) {
        return res.status(400).json({
            message: "Account creation failed: Missing username or password",
        });
    }

    try {
        // Check if username already exists
        const existingEmployer = await findBusinessEmployerUsername(username);
        if (existingEmployer) {
            return res.status(409).json({ message: "Username already exists" });
        }

        // Generate JWT token with registration data
        const token = jwt.sign({ username, password }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Create verification link
        const verificationLink = `http://localhost:${process.env.PORT}/register/employer/business/verify?token=${token}`;

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: username, // username is the email
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
    console.log(token);
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { username, password } = decoded;
        console.log(decoded);
        
        // Use the service function to check if user exists
        const existingEmployer = await findBusinessEmployerUsername(username);
        if (existingEmployer) {
            return res.send("Account already verified or exists.");
        }

        // Insert into database
        await createBusinessEmployer(username, password);

        res.send("Email verified and account created successfully!");
    } catch (err) {
        res.status(400).send("Invalid or expired verification link.");
    }
}

module.exports = { register, verifyEmail };