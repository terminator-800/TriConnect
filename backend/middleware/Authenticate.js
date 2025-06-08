const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { 
            id: decoded.userId,       // Attach user ID
            email: decoded.email, // Attach user email
            role: decoded.role    // Attach user role
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
};

module.exports = authenticate;