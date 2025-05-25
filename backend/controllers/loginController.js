const jwt = require("jsonwebtoken");
const dbPromise = require("../config/DatabaseConnection");

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await dbPromise;
        // Find user by email
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        const user = rows[0];
        console.log([rows]);
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password directly (plain text)
        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            role: user.role,
            userId: user.id
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { login };