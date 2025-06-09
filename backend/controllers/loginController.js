const jwt = require("jsonwebtoken");
const dbPromise = require("../config/DatabaseConnection");
const { findUsersEmail } = require("../service/UsersQuery");

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await dbPromise;
        const user = await findUsersEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.session.user = {
            id: user.user_id, 
            role: user.role, 
            email: user.email, 
        };

        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            role: user.role,
            userId: user.user_id,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { login };