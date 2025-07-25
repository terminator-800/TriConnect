require('dotenv').config();
const jwt = require("jsonwebtoken");
const { getUserConversations, getMessageHistoryByConversationId, processSeenMessages } = require("../service/messageService")
const { handleMessageUpload } = require('../service/conversationsQuery');

const conversations = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    const rows = await getUserConversations(user_id); 
    res.json(rows);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Server error or invalid token" });
  }
};

const messageHistory = async (req, res) => {
  const { conversation_id } = req.params;

  try {
    const messages = await getMessageHistoryByConversationId(conversation_id);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const replyMessage = async (req, res) => {
  const { sender_id, receiver_id, message_text } = req.body;

  try {
    const newMessage = await handleMessageUpload({
      sender_id,
      receiver_id,
      message: message_text,
      file: req.file,
    });

    newMessage.created_at = new Date().toISOString();
    newMessage.is_read = false;

    const roomId = newMessage.conversation_id;
    if (!roomId) {
      return res.status(400).json({ error: "Missing conversation_id" });
    }

    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');

    const receiverSocketId = userSocketMap[receiver_id];
    const senderSocketId = userSocketMap[sender_id];

    const room = io.sockets.adapter.rooms.get(roomId.toString());
    const isReceiverInRoom = room?.has(receiverSocketId);
    const isSenderInRoom = room?.has(senderSocketId);

    io.to(roomId.toString()).emit('receiveMessage', newMessage);

    if (receiverSocketId && !isReceiverInRoom) {
      io.to(receiverSocketId).emit('receiveMessage', newMessage);
    }

    if (senderSocketId && !isSenderInRoom) {
      io.to(senderSocketId).emit('receiveMessage', newMessage);
    }

    res.status(201).json({
      message: 'Message sent and stored successfully',
      conversation_id: newMessage.conversation_id,
      file_url: newMessage.file_url,
    });

  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const markAsSeen = async (req, res) => {
  const { messageIds, viewerId } = req.body;

  if (!Array.isArray(messageIds) || messageIds.length === 0 || typeof viewerId !== 'number') {
    return res.status(400).json({ error: 'Invalid messageIds or viewerId' });
  }

  try {
    const { validMessageIds, updated, messageDetails } = await processSeenMessages(messageIds, viewerId);

    if (validMessageIds.length === 0) {
      return res.status(403).json({ error: 'No messages belong to the viewer' });
    }

    const senderToMessages = {};
    for (const msg of messageDetails) {
      if (!senderToMessages[msg.sender_id]) {
        senderToMessages[msg.sender_id] = {
          conversation_id: msg.conversation_id,
          message_ids: [],
        };
      }
      senderToMessages[msg.sender_id].message_ids.push(msg.message_id);
    }

    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');

    for (const [senderId, data] of Object.entries(senderToMessages)) {
      const senderSocketId = userSocketMap[senderId];
      if (senderSocketId) {
        io.to(senderSocketId).emit('messagesSeen', data);
      }
    }

    return res.json({
      success: true,
      updated,
      seenMessageIds: validMessageIds,
    });
  } catch (error) {
    console.error(`❌ Error in markAsSeen for viewerId ${viewerId}:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    conversations,
    messageHistory,
    replyMessage,
    markAsSeen
}