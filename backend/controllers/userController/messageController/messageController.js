require('dotenv').config();
const jwt = require("jsonwebtoken");
const { getMessageHistoryByConversationId, processSeenMessages } = require("../../../service/messageService")
const { handleMessageUpload } = require('../../../service/handle-message-upload');
const pool = require("../../../config/DatabaseConnection");

// const conversations = async (req, res) => {
//   let connection;

//   try {
//     const user_id = req.user.user_id;

//     connection = await pool.getConnection();

//     const rows = await getUserConversations(connection, user_id);

//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching conversations:', err);
//     res.status(500).json({ error: 'Server error' });
//   } finally {
//     if (connection) connection.release();
//   }
// };

// const messageHistory = async (req, res) => {
//   let connection;

//   const { conversation_id } = req.params;

//   try {

//     connection = await pool.getConnection();

//     const messages = await getMessageHistoryByConversationId(connection, conversation_id);

//     res.json(messages);
//   } catch (err) {
//     console.error('Error fetching messages:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//     if (connection) connection.release();
//   }
// };

// const replyMessage = async (req, res) => {
//   let connection;
//   const { receiver_id, message_text } = req.body;
//   const sender_id = req.user.user_id;

//   try {
//     connection = await pool.getConnection();
//     console.log("Uploaded files:", req.files);
//     const newMessage = await handleMessageUpload(connection, {
//       sender_id,
//       receiver_id,
//       message: message_text,
//       files: req.files, // ✅ multiple files
//     });

//     // newMessage is the latest file or text message
//     newMessage.created_at = new Date().toISOString();
//     newMessage.is_read = false;

//     const roomId = newMessage.conversation_id;
//     if (!roomId) {
//       return res.status(400).json({ error: "Missing conversation_id" });
//     }

//     const io = req.app.get('io');
//     const userSocketMap = req.app.get('userSocketMap');

//     const receiverSocketId = userSocketMap[receiver_id];
//     const senderSocketId = userSocketMap[sender_id];

//     const room = io.sockets.adapter.rooms.get(roomId.toString());
//     const isReceiverInRoom = room?.has(receiverSocketId);
//     const isSenderInRoom = room?.has(senderSocketId);

//     io.to(roomId.toString()).emit('receiveMessage', newMessage);

//     if (receiverSocketId && !isReceiverInRoom) {
//       io.to(receiverSocketId).emit('receiveMessage', newMessage);
//     }

//     if (senderSocketId && !isSenderInRoom) {
//       io.to(senderSocketId).emit('receiveMessage', newMessage);
//     }

//     res.status(201).json({
//       message: 'Message sent and stored successfully',
//       conversation_id: newMessage.conversation_id,
//       file_url: newMessage.file_url || null,
//     });

//   } catch (error) {
//     console.error('❌ Error sending message:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   } finally {
//     if (connection) connection.release();
//   }
// };


// const markAsSeen = async (req, res) => {
//   let connection;
//   const viewer_id = req.user.user_id;

//   const { message_id } = req.body;

//   if (!Array.isArray(message_id) || message_id.length === 0) {
//     return res.status(400).json({ error: 'Invalid message_ids' });
//   }

//   try {
//     connection = await pool.getConnection();

//     const { validMessageIds, updated, messageDetails } = await processSeenMessages(connection, message_id, viewer_id);

//     if (validMessageIds.length === 0) {
//       return res.status(403).json({ error: 'No messages belong to the viewer' });
//     }

//     const senderToMessages = {};
//     for (const msg of messageDetails) {
//       if (!senderToMessages[msg.sender_id]) {
//         senderToMessages[msg.sender_id] = {
//           conversation_id: msg.conversation_id,
//           message_ids: [],
//         };
//       }
//       senderToMessages[msg.sender_id].message_ids.push(msg.message_id);
//     }

//     const io = req.app.get('io');
//     const userSocketMap = req.app.get('userSocketMap');

//     for (const [senderId, data] of Object.entries(senderToMessages)) {
//       const senderSocketId = userSocketMap[senderId];
//       if (senderSocketId) {
//         io.to(senderSocketId).emit('messagesSeen', data);
//       }
//     }

//     console.log(`✅ Viewer ${viewer_id} marked messages as seen:`, validMessageIds);

//     return res.json({
//       success: true,
//       updated,
//       seenMessageIds: validMessageIds,
//     });
//   } catch (error) {
//     console.error(`❌ Error in markAsSeen for viewerId ${viewer_id}:`, error);
//     return res.status(500).json({ error: 'Internal server error' });
//   } finally {
//     if (connection) connection.release();
//   }
// };

module.exports = {
  // conversations,
  // messageHistory,
  // replyMessage,
  // markAsSeen
}