const { Server } = require("socket.io");
const pool = require("./databaseConnection");

function initializeSocket(server, userSocketMap) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const withDb = async (callback) => {
    const connection = await pool.getConnection();
    try {
      return await callback(connection);
    } finally {
      connection.release();
    }
  };

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      if (!roomId) return console.log("❌ Invalid roomId:", roomId);
      socket.join(roomId.toString());
      console.log(`🛋️ User joined room: ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
      if (!roomId) return console.log("❌ Invalid roomId:", roomId);
      socket.leave(roomId.toString());
      console.log(`🚪 User left room: ${roomId}`);
    });

    socket.on("register", (user_id) => {
      if (userSocketMap[user_id] && userSocketMap[user_id] !== socket.id) {
        console.log(`⚠️ Overwriting existing socket for user ${user_id}`);
      }
      userSocketMap[user_id] = socket.id;
      console.log(`✅ User ${user_id} registered with socket ${socket.id}`);

      // Send any queued messages for this user
      sendQueuedMessages(user_id, socket);
    });

    socket.on("markMessagesSeen", async ({ conversation_id, user_id }, callback) => {
      try {
        await withDb(async (conn) => {
          await conn.query(
            `UPDATE messages SET is_read = 1, read_at = NOW() WHERE conversation_id = ? AND receiver_id = ? AND is_read = 0`,
            [conversation_id, user_id]
          );
        });

        // Emit to room
        socket.to(conversation_id.toString()).emit("messagesSeen", {
          conversation_id,
          seen_by: user_id,
        });

        // Emit globally to all users
        io.emit("messagesSeen", {
          conversation_id,
          seen_by: user_id,
        });

        if (callback) callback({ success: true });
      } catch (err) {
        console.error("❌ Error updating messagesSeen:", err);
        if (callback) callback({ success: false, error: err.message });
      }
    });

    socket.on("disconnect", () => {
      const disconnectedUserId = Object.keys(userSocketMap).find(
        (key) => userSocketMap[key] === socket.id
      );

      if (disconnectedUserId) {
        delete userSocketMap[disconnectedUserId];
        console.log(`❌ User ${disconnectedUserId} disconnected`);
      } else {
        console.log(`❌ Unknown socket disconnected: ${socket.id}`);
      }
    });

  });

  // Function to send queued messages when user comes online
  const sendQueuedMessages = async (userId, socket) => {
    try {
      await withDb(async (conn) => {
        // First get all unread messages for the user
        const [messages] = await conn.query(
          `SELECT m.*, c.conversation_id 
           FROM messages m 
           JOIN conversations c ON m.conversation_id = c.conversation_id 
           WHERE m.receiver_id = ? AND m.is_read = 0 
           ORDER BY m.created_at DESC 
           LIMIT 10`,
          [userId]
        );

        if (messages.length > 0) {
          console.log(`📨 Sending ${messages.length} queued messages to user ${userId}`);
          
          // For each message, get the sender name from the appropriate table
          for (const message of messages) {
            try {
              // Get the sender's role first
              const [userResult] = await conn.query(
                'SELECT role FROM users WHERE user_id = ?',
                [message.sender_id]
              );
              
              if (userResult.length > 0) {
                const senderRole = userResult[0].role;
                let tableName;
                
                switch (senderRole) {
                  case 'jobseeker':
                    tableName = 'jobseeker';
                    break;
                  case 'business-employer':
                    tableName = 'business_employer';
                    break;
                  case 'individual-employer':
                    tableName = 'individual_employer';
                    break;
                  case 'manpower-provider':
                    tableName = 'manpower_provider';
                    break;
                  case 'administrator':
                    tableName = 'administrators';
                    break;
                  default:
                    tableName = 'users';
                }
                
                // Get the sender name from the appropriate table
                const [nameResult] = await conn.query(
                  `SELECT full_name FROM ${tableName} WHERE ${tableName === 'jobseeker' ? 'jobseeker_id' : 
                    tableName === 'business_employer' ? 'business_employer_id' :
                    tableName === 'individual_employer' ? 'individual_employer_id' :
                    tableName === 'manpower_provider' ? 'manpower_provider_id' :
                    'user_id'} = ?`,
                  [message.sender_id]
                );
                
                if (nameResult.length > 0) {
                  message.sender_name = nameResult[0].full_name;
                } else {
                  message.sender_name = 'Unknown User';
                }
              } else {
                message.sender_name = 'Unknown User';
              }
            } catch (error) {
              console.log('Could not get sender name for message:', error.message);
              message.sender_name = 'Unknown User';
            }
            
            socket.emit('receiveMessage', message);
          }
        }
      });
    } catch (err) {
      console.error("❌ Error sending queued messages:", err);
    }
  };

  // Global function to emit messages to all users
  const emitGlobalMessage = (message) => {
    // Emit to specific room
    io.to(message.conversation_id.toString()).emit('receiveMessage', message);
    
    // Emit globally to all connected users
    io.emit('receiveMessage', message);
    
    // Emit conversation update
    io.emit('conversationUpdate', {
      conversation_id: message.conversation_id,
      last_message: message
    });
  };

  // Make emitGlobalMessage available to other parts of the app
  io.emitGlobalMessage = emitGlobalMessage;

  return io;
}

module.exports = initializeSocket;
