const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findUsersEmail } = require("../service/usersQuery");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUsersEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,     
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      role: user.role,
      userId: user.user_id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Lax'
    });

    return res.status(200).send('Logged out successfully');
  } catch (error) {
    return res.status(500).send('Logout failed');
  }
};

module.exports = { login, logout };
