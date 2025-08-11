const { handleMessageUpload } = require('../../service/handle-message-upload');
const { insertJobApplication, transferTempFilesIfConversationExists } = require("../../helpers/apply-job-post-helper");
const pool = require("../../config/databaseConnection");

const apply = async (req, res) => {
  let connection;
  const { receiver_id, message, job_post_id } = req.body;
  const sender_id = req.user.user_id;
  const role = req.user.role;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await insertJobApplication(connection, job_post_id, sender_id, role);

    const newMessage = await handleMessageUpload(connection, {
      sender_id,
      receiver_id,
      message,
      file: req.file,
    });
    
    await transferTempFilesIfConversationExists(connection, sender_id, receiver_id);

    if (!newMessage.conversation_id) {
      await connection.rollback();
      console.error("❌ Cannot broadcast: conversation_id is missing!", newMessage);
      return res.status(400).json({ error: "Missing conversation_id" });
    }

    await connection.commit();

    newMessage.created_at = new Date().toISOString();
    newMessage.is_read = false;

    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');
    const roomId = newMessage.conversation_id;

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
    await connection.rollback();
    console.error('❌ Error applying to job post:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

module.exports = {
  apply,
};
