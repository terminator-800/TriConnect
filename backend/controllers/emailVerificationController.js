require('dotenv').config();
const { findUsersEmail, markRegistered } = require("../service/usersQuery")
const jwt = require("jsonwebtoken");

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).send("Missing token.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, role } = decoded;
    
    if (!email || !role) {
      return res.status(400).send("Invalid token payload.");
    }
    
    const user = await findUsersEmail(email);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.is_registered) {
      return res.status(200).send("User already verified.");
    }

    await markRegistered(email);

    return res.status(200).send("Email verified and account registered!");
  } catch (error) {
    console.error("❌ Verification error:", error.message);
    return res.status(400).send("Invalid or expired verification link.");
  }
};

module.exports = { verifyEmail };
