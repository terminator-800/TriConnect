const { Server } = require("socket.io");

function initializeSocket(server, userSocketMap) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      if (!roomId) {
        console.log("❌ joinRoom called with invalid roomId:", roomId);
        return;
      }

      socket.join(roomId.toString());
      console.log(`🛋️ User joined room: ${roomId}`, socket.id);
    });

    socket.on("register", (user_id) => {
      userSocketMap[user_id] = socket.id;
      console.log(`✅ Registered user ${user_id} with socket ${socket.id}`);
    });

    // Optionally, you can still keep `receiveMessage` here if needed:
    // socket.on("sendMessage", (data) => {
      // const { sender_id, receiver_id, message_text, file_url, conversation_id } = data;

      // Forward the message to the receiver if connected
      // const receiverSocketId = userSocketMap[receiver_id];
      // if (receiverSocketId) {
      //   io.to(receiverSocketId).emit("receiveMessage", {
      //     sender_id,
      //     receiver_id,
      //     message_text,
      //     file_url,
      //     conversation_id,
      //     created_at: new Date().toISOString(),
      //   });
      // }

      // Also emit to the sender's room (in case needed)
      // socket.to(conversation_id?.toString()).emit("receiveMessage", {
      //   sender_id,
      //   receiver_id,
      //   message_text,
      //   file_url,
      //   conversation_id,
      //   created_at: new Date().toISOString(),
      // });
    // });

    socket.on("messagesSeen", ({ conversation_id, message_ids }) => {
      socket.to(conversation_id.toString()).emit("messagesSeen", {
        conversation_id,
        message_ids,
      });
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of Object.entries(userSocketMap)) {
        if (id === socket.id) {
          delete userSocketMap[userId];
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
}



module.exports = initializeSocket;
