const { Server } = require("socket.io");
const {
  getMessagesByUserId,
  getLatestMessagesGroupedByConversation,
} = require("../service/chat");

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
      console.log(`🛋️ backend User joined room: ${roomId}`, socket.id);
    });

    socket.on("register", (user_id) => {
      userSocketMap[user_id] = socket.id;
      console.log(`✅ Registered user ${user_id} with socket ${socket.id}`);
    });

    socket.on("getMessagesByUserId", async (user_id) => {
      try {
        const messages = await getMessagesByUserId(user_id);
        socket.emit("messagesByUserId", messages);
      } catch (error) {
        console.error("❌ Error fetching messages by user ID:", error);
        socket.emit("messagesByUserIdError", "Failed to load messages.");
      }
    });

    socket.on("getLatestMessages", async (user_id) => {
      try {
        const messages = await getLatestMessagesGroupedByConversation(user_id);
        socket.emit("latestMessages", messages);
      } catch (error) {
        console.error("❌ Error fetching latest messages:", error);
        socket.emit("latestMessagesError", "Failed to load latest messages.");
      }
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
