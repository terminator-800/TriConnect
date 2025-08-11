const { handleMessageUpload } = require("../../../service/handle-message-upload");
const pool = require("../../../config/databaseConnection2")

const replyMessage = async (req, res) => {
  let connection;
  const { receiver_id, message_text } = req.body;
  const sender_id = req.user.user_id;

  try {
    connection = await pool.getConnection();
    console.log("Uploaded files:", req.files);
    const newMessage = await handleMessageUpload(connection, {
      sender_id,
      receiver_id,
      message: message_text,
      files: req.files, // ✅ multiple files
    });

    // newMessage is the latest file or text message
    newMessage.created_at = new Date().toISOString();
    newMessage.is_read = false;

    const roomId = newMessage.conversation_id;
    if (!roomId) {
      return res.status(400).json({ error: "Missing conversation_id" });
    }

    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');

    // Get sender name from the appropriate table based on role
    let senderName = 'Unknown User';
    try {
      // First get the sender's role
      const [userResult] = await connection.query(
        'SELECT role FROM users WHERE user_id = ?',
        [sender_id]
      );
      
      if (userResult.length > 0) {
        const senderRole = userResult[0].role;
        let tableName;
        
        switch (senderRole) {
          case 'jobseeker':
            tableName = 'jobseekers';
            break;
          case 'business-employer':
            tableName = 'business_employers';
            break;
          case 'individual-employer':
            tableName = 'individual_employers';
            break;
          case 'manpower-provider':
            tableName = 'manpower_providers';
            break;
          case 'administrator':
            tableName = 'administrators';
            break;
          default:
            tableName = 'users';
        }
        
        // Get the sender name from the appropriate table
        const [nameResult] = await connection.query(
          `SELECT full_name FROM ${tableName} WHERE user_id = ?`,
          [sender_id]
        );
        
        if (nameResult.length > 0) {
          senderName = nameResult[0].full_name;
        }
      }
    } catch (error) {
      console.log('Could not get sender name:', error.message);
    }

    newMessage.sender_name = senderName;

    // Use global emit function for real-time notifications everywhere
    if (io.emitGlobalMessage) {
      io.emitGlobalMessage(newMessage);
      console.log(`📨 Global message emitted for conversation ${roomId}`);
    } else {
      // Fallback to room-based emission
      io.to(roomId.toString()).emit('receiveMessage', newMessage);
      
      const receiverSocketId = userSocketMap[receiver_id];
      const senderSocketId = userSocketMap[sender_id];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', newMessage);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit('receiveMessage', newMessage);
      }
    }

    res.status(201).json({
      message: 'Message sent and stored successfully',
      conversation_id: newMessage.conversation_id,
      file_url: newMessage.file_url || null,
    });

  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
    replyMessage
}
