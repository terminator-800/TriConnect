const { getUserConversations } = require("../../../service/messageService/get-user-conversations-service")
const pool = require("../../../config/databaseConnection");

const conversations = async (req, res) => {
    let connection;

    try {

        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        connection = await pool.getConnection();
        const user_id = req.user.user_id;

        const rows = await getUserConversations(connection, user_id);

        res.json(rows);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    conversations
}