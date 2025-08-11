require('dotenv').config();
const { handleMessageUpload } = require('../../service/handle-message-upload');
const pool = require("../../config/databaseConnection");

const contactAgency = async (req, res) => {
    const { receiver_id, message } = req.body;
    const sender_id = req.user?.user_id;

    if (!sender_id || !receiver_id || !message) {
        return res.status(400).json({ error: "Missing sender_id, receiver_id, or message" });
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const newMessage = await handleMessageUpload(connection, {
            sender_id,
            receiver_id,
            message,
            file: req.file,
        });

        if (!newMessage || !newMessage.conversation_id) {
            await connection.rollback();
            return res.status(400).json({ error: "Message upload failed or missing conversation_id" });
        }

        await connection.commit();

        // Add necessary metadata
        newMessage.created_at = new Date().toISOString();
        newMessage.is_read = false;

        const roomId = newMessage.conversation_id;

        // Emit message via Socket.IO
        const io = req.app.get('io');
        const userSocketMap = req.app.get('userSocketMap');

        io.to(roomId.toString()).emit('receiveMessage', newMessage);

        const receiverSocketId = userSocketMap?.[receiver_id];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', newMessage);
            console.log(`📢 Notified receiver ${receiver_id} via socket ${receiverSocketId}`);
        } else {
            console.log(`⚠️ Receiver ${receiver_id} not currently connected`);
        }

        res.status(201).json({
            message: 'Application sent and message stored',
            conversation_id: newMessage.conversation_id,
            file_url: newMessage.file_url,
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('❌ Error during agency contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    contactAgency
};
