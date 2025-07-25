require('dotenv').config();
const { findUsersEmail } = require("../service/usersQuery");
const { createUsers } = require("../service/usersQuery")
const { ROLE } = require("../utils/roles")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const { CLIENT_ORIGIN, JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;

if (!CLIENT_ORIGIN || !JWT_SECRET || !EMAIL_USER || !EMAIL_PASS) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const allowedRoles = {
  [ROLE.BUSINESS_EMPLOYER]: "business employer",
  [ROLE.INDIVIDUAL_EMPLOYER]: "individual employer",
  [ROLE.JOBSEEKER]: "jobseeker",
  [ROLE.MANPOWER_PROVIDER]: "manpower provider",
};

const registerUser = async (req, res) => {
  const { email, role, password } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Missing email or role." });
  }

  if (!allowedRoles[role]) {
    return res.status(400).json({ message: "Invalid role type." });
  }

  try {
    const existingUser = await findUsersEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUsers(email, hashedPassword, role);

    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: "1h" });
    const verificationLink = `${process.env.API_BASE_URL}/${role}/verify?token=${token}`;
    const emailSubject = `Verify your ${allowedRoles[role]} email`;

    const htmlMessage = `
      <p>Hello,</p>
      <p>Please verify your email address to complete registration as a <strong>${allowedRoles[role]}</strong>.</p>
      <p>Click the link below to verify:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await transporter.sendMail({
      from: `"TriConnect" <${EMAIL_USER}>`,
      to: email,
      subject: emailSubject,
      html: htmlMessage,
    });

    return res.status(201).json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("❌ Error sending email:", error.stack || error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { registerUser };
