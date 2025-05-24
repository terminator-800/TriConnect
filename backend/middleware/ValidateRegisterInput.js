function validateRegisterInput(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing username or password" });
    }
    console.log("Middleware validating registration input:", { email, password });
    next(); 
}

module.exports = validateRegisterInput;