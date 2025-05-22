function validateRegisterInput(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password" });
    }
    console.log("Middleware validating registration input:", { username, password });
    next(); 
}

module.exports = validateRegisterInput;