const { createIndividualEmployer, findIndividualEmployerUsername } = require("../service/IndividualEmployerQuery");

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Account creation failed: Missing username or password",
        });
    }

    try {
        const existingEmployer = await findIndividualEmployerUsername(username);
        if (existingEmployer) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const result = await createIndividualEmployer(username, password);
        if (result && result.insertId) {
            console.log(`New Individual User : ${result.insertId}`);
            return res.status(201).json({
                message: "Account created successfully",
                userId: result.insertId,
            });
        } else {
            return res.status(500).json({ message: "Account creation failed" });
        }
    } catch (error) {
        console.error("Error creating employer account:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = register;