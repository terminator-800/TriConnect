const verifySession = async (req, res) => {
    try {
        if (req.session && req.session.userId && req.session.role) {
            let roleMessage;
          
            return res.status(200).json({
                authenticated: true,
                message: roleMessage,
                
                role: req.session.role,
                user: req.session.userId,
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