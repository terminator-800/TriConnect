const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        console.log(`[AUTH FAILED] No token provided for ${req.method} ${req.originalUrl}`);
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { 
            user_id: decoded.user_id,
            email: decoded.email,
            role: decoded.role,
            is_registered: decoded.is_registered
        };

        console.log(`[AUTH OK] User ${decoded.user_id} (${decoded.role}) accessed ${req.method} ${req.originalUrl}`);

        next();
    } catch (error) {
        console.log(`[AUTH FAILED] Invalid token for ${req.method} ${req.originalUrl}:`, error.message);
        res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
};

module.exports = { authenticate };
