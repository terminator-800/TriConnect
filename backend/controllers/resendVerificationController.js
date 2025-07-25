const jwt = require("jsonwebtoken");
const { findUsersEmail } = require("../service/usersQuery");
const nodemailer = require("nodemailer");
const { ROLE } = require("../utils/roles");

const { JWT_SECRET, EMAIL_USER, EMAIL_PASS, API_BASE_URL } = process.env;

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

const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const user = await findUsersEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.is_registered) {
      return res.status(400).json({ message: "User already verified." });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role, user_id: user.user_id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const verificationLink = `${API_BASE_URL}/${user.role}/verify?token=${token}`;
    const subject = `Verify your ${allowedRoles[user.role]} email`;

    const html = `
      <p>Hello,</p>
      <p>You requested a new verification link for your <strong>${allowedRoles[user.role]}</strong> account.</p>
      <p>Click below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await transporter.sendMail({
      from: `"TriConnect" <${EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    return res.status(200).json({ message: "Verification email resent." });
  } catch (error) {
    console.error("Error resending verification:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { resendVerification };
