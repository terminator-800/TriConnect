const { handleMessageUpload } = require('../service/conversationsQuery');
const { getUserInfo } = require("../service/usersQuery");
const dbPromise = require("../config/DatabaseConnection");

const apply = async (req, res) => {
  const { sender_id, receiver_id, message, job_post_id } = req.body;

  try {
    const sender = await getUserInfo(sender_id);
    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    const db = await dbPromise;
    await db.execute(
      `INSERT INTO job_applications (job_post_id, applicant_id, role, applied_at)
       VALUES (?, ?, ?, NOW())`,
      [job_post_id, sender_id, sender.role]
    );

    const newMessage = await handleMessageUpload({
      sender_id,
      receiver_id,
      message,
      file: req.file,
    });

    newMessage.created_at = new Date().toISOString();
    newMessage.is_read = false;

    const roomId = newMessage.conversation_id;

    if (!roomId) {
      console.error("❌ Cannot broadcast: conversation_id is missing!", newMessage);
      return res.status(400).json({ error: "Missing conversation_id" });
    }

    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');

    io.to(roomId.toString()).emit('receiveMessage', newMessage);
    console.log(`📨 Sent application to room ${roomId}`, newMessage);

    const receiverSocketId = userSocketMap?.[receiver_id];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', newMessage);
      console.log(`📢 Also notified receiver ${receiver_id} via socket ${receiverSocketId}`);
    } else {
      console.log(`⚠️ Receiver ${receiver_id} not currently connected`);
    }

    res.status(201).json({
      message: 'Application sent and message stored',
      conversation_id: newMessage.conversation_id,
      file_url: newMessage.file_url,
    });

  } catch (error) {
    console.error('❌ Error applying to job post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  apply
}
