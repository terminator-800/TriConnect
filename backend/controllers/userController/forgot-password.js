const { updateUserPassword } = require("../../service/update-user-password-service");
const { findUsersEmail } = require("../../service/find-user-email-service");
const jwt = require("jsonwebtoken");
const pool = require("../../config/databaseConnection2")
const nodemailer = require("nodemailer");

const forgotPassword = async (req, res) => {
  let connection;
  const { email } = req.body;

  try {

    connection = await pool.getConnection()
    await connection.beginTransaction();
    const user = await findUsersEmail(connection, email);
    

    if (!user) {
      await connection.rollback();
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

    await connection.commit();

    res.json({ message: "If this email exists, a reset link has been sent." });

  } catch (error) {

    if (connection) connection.rollback();
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });

  } finally {
    if (connection) connection.release()
  }

};

const resetPassword = async (req, res) => {
  let connection;
  const { token, password } = req.body;

  try {
    connection = await pool.getConnection()
    await connection.beginTransaction();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    await updateUserPassword(connection, email, password);
    await connection.commit();
    res.json({ message: "Password has been reset successfully." });

  } catch (error) {
    if (connection) connection.rollback()
    console.error("Reset password error:", error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Your reset link has expired. Please request a new one." });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid reset token. Please request a new one." });
    }

    res.status(500).json({ message: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
