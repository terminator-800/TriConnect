const verifySession = async (req, res) => {
    try {
        if (req.session && req.session.user.id && req.session.user.role) {
            let roleMessage;
            
            return res.status(200).json({
                authenticated: true,
                message: roleMessage,
                
                role: req.session.user.role,
                user: req.session.user.id,
            });
            
        } else {
            return res.status(401).json({
                authenticated: false,
                message: "Session not found or user not authenticated",
            });
        }
    } catch (error) {
        return res.status(500).json({
            authenticated: false,
            message: "Internal server error",
        });
    }
};

module.exports = { verifySession };