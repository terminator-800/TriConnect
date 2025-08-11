require('dotenv').config();
const { findUsersEmail } = require("../../service/find-user-email-service");
const { markRegistered } = require("../../service/mark-registered-service")
const jwt = require("jsonwebtoken");
const pool = require("../../config/DatabaseConnection");

const verifyEmail = async (req, res) => {
  let connection
  const { token } = req.query;

  if (!token) {

    return res.status(400).send("Missing token.");
  }

  try {

    connection = await pool.getConnection();
    await connection.beginTransaction();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { email, role } = decoded;

    if (!email || !role) {
      return res.status(400).send("Invalid token payload.");
    }

    const user = await findUsersEmail(connection, email);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.is_registered) {
      return res.status(200).send("User already verified.");
    }

    await markRegistered(connection, email);
    await connection.commit();

    return res.status(200).send("Email verified and account registered!");

  } catch (error) {

    if (connection) await connection.rollback();

    console.error("❌ Verification error:", error.message);
    return res.status(400).send("Invalid or expired verification link.");

  } finally {

    if (connection) connection.release();
  }

};

module.exports = { verifyEmail };
