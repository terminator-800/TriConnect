require('dotenv').config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { createBusinessEmployer, createJobPostQuery } = require("../service/BusinessEmployerQuery");
const { findUsersEmail, createUsers } = require("../service/UsersQuery");

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

        await createBusinessEmployer(email, password);
        await createUsers(email, password, role);
        console.log("Business employer account created successfully!");
        res.send("Email verified and account created successfully!");
    } catch (err) {
        res.status(400).send("Invalid or expired verification link.");
    }
}

const createJobPost = async (req, res) => {
    const {
        job_title,
        job_type,
        salary_range,
        location,
        required_skill,
        job_description,
    } = req.body;

    console.log("this is line 69: ", req.body);
    console.log("this is line 70", job_title);
    console.log("this is line 70", job_type);
    console.log("this is line 70", salary_range);
    console.log("this is line 70", location);
    console.log("this is line 70", required_skill);
    console.log("this is line 70", job_description);
    try {
        // Check if the user is authenticated
        if (!req.session.user) {
            return res.status(401).json({ error: "Unauthorized: User not logged in." });
        }

        const { id: user_id, role } = req.session.user;

        // Ensure the user has the correct role
        if (role !== "business_employer") {
            return res.status(403).json({ error: "Forbidden: Only business employers can create job posts." });
        }

        // Validate the data
        if (!job_title || !job_type || !salary_range || !location || !job_description || !required_skill) {
            return res.status(400).json({ error: "All required fields must be filled out." });
        }

        console.log("this is line 93");

        // Additional validation
        const validJobTypes = ["full-time", "part-time", "contract"];
        if (!validJobTypes.includes(job_type)) {
            return res.status(400).json({ error: "Invalid job type." });
        }

        // const [min, max] = salary_range.split("-").map(Number);
        // if (!min || !max || min > max) {
        //     return res.status(400).json({ error: "Invalid salary range format or values." });
        // }

        // Call the query function to insert the job post
        const result = await createJobPostQuery(
            user_id, role, job_title, job_type, salary_range, location, required_skill, job_description
        );

        // Respond to the client
        res.status(201).json({
            message: "Job post created successfully!",
            job_post_id: result.jobId, // assuming you return result.jobId from your query
        });
    } catch (error) {
        console.error("Error creating job post:", error.stack);

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "Invalid input data." });
        }

        res.status(500).json({ error: "Failed to create job post." });
    }
};


module.exports = { register, verifyEmail, createJobPost };
