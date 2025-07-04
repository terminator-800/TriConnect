const jwt = require("jsonwebtoken");

const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: "Token not found in cookies",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      authenticated: true,
      role: decoded.role,
      user: decoded.id,
      message: `Authenticated as ${decoded.role}`,
    });
  } catch (error) {
    return res.status(401).json({
      authenticated: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { verifyToken };
