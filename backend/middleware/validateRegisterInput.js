function validateRegisterInput(req, res, next) {
    const { email, password, role } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Missing username or password" });
    }
    console.log("Middleware validating registration input:", { email, password, role });
    next(); 
}

module.exports =  validateRegisterInput ;