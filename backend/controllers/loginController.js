const jwt = require("jsonwebtoken");
const { findBusinessEmployerEmail } = require("../service/BusinessEmployerQuery");
const { findJobseekerEmail} = require("../service/JobseekerQuery");
const { findIndividualEmployerEmail } = require("../service/IndividualEmployerQuery");
const { findManpowerProviderEmail } = require("../service/ManpowerProviderQuery");
// const { findAdminByEmail } = require("../service/AdminQuery"); 

const login = async (req, res) => {
    const { email, password } = req.body;

    // Try to find the user in each table
    // let user = await findAdminByEmail?.(email);
    // let role = "admin";
    if (!user) {
        user = await findBusinessEmployerEmail(email);
        role = "business_employer";
    }
    if (!user) {
        user = await findJobseekerEmail(email);
        role = "jobseeker";
    }
    if (!user) {
        user = await findIndividualEmployerEmail(email);
        role = "individual_employer";
    }
    if (!user) {
        user = await findManpowerProviderEmail(email);
        role = "manpower_provider";
    }

    if (!user) {
        return res.status(401).json(
            console.log(`Login failed: No user found with email ${email}`),
            { message: "Invalid email or password" }
        );
    }

    // Compare password (assuming hashed passwords)
    // const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    // const token = jwt.sign(
    //     { id: user.id, email: user.email, role },
    //     process.env.JWT_SECRET,
    //     { expiresIn: "1d" }
    // );

    res.status(200).json({
        message: "Login successful",
        token,
        role,
        userId: user.id
    });
};

module.exports = { login };