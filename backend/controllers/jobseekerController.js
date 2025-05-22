const { createJobseeker, findJobseekerByUsername } = require('../service/JobseekerQuery');

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Account creation failed: Missing username or password",
        });
    }

    try {
        const existingUser = await findJobseekerByUsername(username);
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const result = await createJobseeker(username, password);
        console.log("New jobseeker ID:", result.insertId);

        return res.status(201).json({
            message: "Account created successfully",
            userId: result.insertId,
        });

    } catch (error) {
        console.error("Error creating jobseeker account:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = register;
