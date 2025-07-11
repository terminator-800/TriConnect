const jwt = require("jsonwebtoken");
const dbPromise = require("../config/DatabaseConnection");
const nodemailer = require("nodemailer");
const { updateUserPassword, findUsersEmail } = require("../service/usersQuery");
const { updateJobseekerPassword } = require("../service/jobseekerQuery");
const { updateBusinessEmployerPassword } = require("../service/BusinessEmployerQuery");
const { updateIndividualEmployerPassword } = require("../service/individualEmployerQuery");
const { updateManpowerProviderPassword } = require("../service/manpowerProviderQuery");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const db = await dbPromise;
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
      return res.json({ message: "If this email exists, a reset link has been sent." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const resetLink = `http://localhost:5173/forgot-password/reset-password?token=${token}`;

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
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 10 minutes.</p>`,
    });

    res.json({ message: "If this email exists, a reset link has been sent." });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    await updateUserPassword(email, password);

    const user = await findUsersEmail(email);

    switch (user.role) {
      case 'jobseeker':
        await updateJobseekerPassword(email, password);
        console.log("Jobseeker password reset.");
        break;

      case 'individual_employer':
        await updateIndividualEmployerPassword(email, password);
        console.log("Individual Employer password reset.");
        break;

      case 'business_employer':
        await updateBusinessEmployerPassword(email, password);
        console.log("Business Employer password reset.");
        break;

      case 'manpower_provider':
        await updateManpowerProviderPassword(email, password);
        console.log("Manpower Provider password reset.");
        break;

      default:
        console.warn("Unknown role during password reset.");
        break;
    }

    res.json({ message: "Password has been reset successfully." });

  } catch (error) {
    console.error("Reset password error:", error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Your reset link has expired. Please request a new one." });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid reset token. Please request a new one." });
    }

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  forgotPassword,
  resetPassword
};
