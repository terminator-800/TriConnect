const { createJobseeker } = require('../service/JobseekerQuery');
const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Account creation failed: Missing username or password",
        });
    }

    try {
        const result = await createJobseeker(username, password)
        console.log("New user ID:", result.insertId);
        return res.status(201).json({
            message: "Account created successfully",
            userId: result.insertId,
        });

    } catch (error) {
        console.error("Error creating jobseeker account:", error.message);

       
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Username already exists" });
        }

        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = register;
