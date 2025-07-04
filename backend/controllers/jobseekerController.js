require('dotenv').config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dbPromise = require("../config/DatabaseConnection");
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const { createJobseeker, uploadJobseekerRequirement } = require("../service/JobseekerQuery");
const { findUsersEmail, createUsers, getUserInfo, uploadUserRequirement } = require("../service/UsersQuery");
const { handleMessageUpload } = require('../service/chat');

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Account creation failed: Missing email or password",
        });
    }

    try {
        const existingJobseeker = await findUsersEmail(email);
        if (existingJobseeker) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const verificationLink = `http://localhost:${process.env.PORT}/register/jobseeker/verify?token=${token}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your jobseeker email",
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email and complete registration.</p>`,
        });
        return res.status(201).json({
            message: "Verification email sent. Please check your inbox to complete registration.",
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, password } = decoded;
        const role = "jobseeker";
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await createUsers(email, hashedPassword, role);
        if (!createdUser || !createdUser.user_id) {
            return res.status(500).send("Failed to create user account.");
        }

        const user_id = createdUser.user_id;

        await createJobseeker(user_id, role, email, hashedPassword);

        console.log("Jobseeker account created successfully!");
        res.send("Email verified and account created successfully!");
    } catch (err) {
        console.error(err);
        res.status(400).send("Invalid or expired verification link.");
    }
};

const getJobseekerProfile = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded?.user_id;
        const role = decoded?.role;

        if (!user_id || role !== 'jobseeker') {
            return res.status(403).json({ error: 'Forbidden: Invalid token data' });
        }

        const jobseekerProfile = await getUserInfo(user_id);
        if (!jobseekerProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.status(200).json(jobseekerProfile);
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const uploadRequirements = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { user_id } = decoded;

        const {
            full_name,
            date_of_birth,
            contact_number,
            gender,
            present_address,
            permanent_address,
            education,
            skills
        } = req.body;

        const government_id = req.files?.government_id?.[0]?.filename || null;
        const selfie_with_id = req.files?.selfie_with_id?.[0]?.filename || null;
        const nbi_barangay_clearance = req.files?.nbi_barangay_clearance?.[0]?.filename || null;

        await uploadJobseekerRequirement({
            user_id,
            full_name,
            date_of_birth,
            contact_number,
            gender,
            present_address,
            permanent_address,
            education,
            skills,
            government_id,
            selfie_with_id,
            nbi_barangay_clearance
        });

        await uploadUserRequirement({
            user_id,
            full_name,
            date_of_birth,
            contact_number,
            gender,
            present_address,
            permanent_address,
            education,
            skills,
            government_id,
            selfie_with_id,
            nbi_barangay_clearance
        })

        res.status(200).json({ message: "Requirements uploaded successfully" });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(401).json({ message: "Unauthorized or invalid token" });
    }
};

const apply = async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  try {
    // Save message (with optional file)
    const newMessage = await handleMessageUpload({
      sender_id,
      receiver_id,
      message,
      file: req.file,
    });

    // Add metadata
    newMessage.created_at = new Date().toISOString();
    newMessage.is_read = false;

    const roomId = newMessage.conversation_id;

    if (!roomId) {
      console.error("❌ Cannot broadcast: conversation_id is missing!", newMessage);
      return res.status(400).json({ error: "Missing conversation_id" });
    }

    // Access socket instance & user map
    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');

    // ✅ Emit to conversation room
    io.to(roomId.toString()).emit('receiveMessage', newMessage);
    console.log(`📨 Sent application to room ${roomId}`, newMessage);

    // ✅ Notify receiver directly if connected
    const receiverSocketId = userSocketMap?.[receiver_id];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', newMessage);
      console.log(`📢 Also notified receiver ${receiver_id} via socket ${receiverSocketId}`);
    } else {
      console.log(`⚠️ Receiver ${receiver_id} not currently connected`);
    }

    // ✅ Final response
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

    // 🟡 1. Always emit to room (whoever is inside will get it)
    io.to(roomId.toString()).emit('receiveMessage', newMessage);

    // 🟡 2. If receiver is NOT in room, emit directly to them
    if (receiverSocketId && !isReceiverInRoom) {
      io.to(receiverSocketId).emit('receiveMessage', newMessage);
    }

    // 🟡 3. If sender is NOT in room, emit directly so they see it too
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

const conversations = async (req, res) => {
    db = await dbPromise;
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;

        // console.log("User ID from token:", user_id);

        const [rows] = await db.query(
            `SELECT conversation_id FROM conversations WHERE user1_id = ? OR user2_id = ?`,
            [user_id, user_id]
        );
        // console.log("rows: ", rows);

        res.json(rows);
    } catch (err) {
        console.error("Error fetching conversations:", err);
        res.status(500).json({ error: "Server error or invalid token" });
    }
};

const messageHistory = async (req, res) => {
    const { conversation_id } = req.params;
    const db = await dbPromise;
    try {
        const [messages] = await db.query(
            `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`,
            [conversation_id]
        );

        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const markAsSeen = async (req, res) => {
  const db = await dbPromise;
  const { messageIds, viewerId } = req.body;

  if (!Array.isArray(messageIds) || messageIds.length === 0 || !viewerId) {
    return res.status(400).json({ error: 'Missing messageIds or viewerId' });
  }

  try {
    // ✅ Update read status
    const [result] = await db.query(
      `UPDATE messages
       SET is_read = TRUE, read_at = NOW()
       WHERE message_id IN (${messageIds.map(() => '?').join(',')})
         AND receiver_id = ?`,
      [...messageIds, viewerId]
    );

    // ✅ Fetch messages to get sender_id and conversation_id
    const [messages] = await db.query(
      `SELECT message_id, sender_id, conversation_id FROM messages
       WHERE message_id IN (${messageIds.map(() => '?').join(',')})`,
      messageIds
    );

    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');

    // ✅ Emit to each unique sender
    const notified = new Set();
    for (const msg of messages) {
      const senderSocketId = userSocketMap[msg.sender_id];
      if (senderSocketId && !notified.has(msg.sender_id)) {
        io.to(senderSocketId).emit('messagesSeen', {
          conversation_id: msg.conversation_id,
          message_ids: messageIds,
        });
        notified.add(msg.sender_id);
      }
    }

    return res.json({ success: true, updated: result.affectedRows });
  } catch (error) {
    console.error('Error marking messages as seen:', error);
    return res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
    register,
    verifyEmail,
    getJobseekerProfile,
    uploadRequirements,
    apply,
    replyMessage,
    conversations,
    messageHistory,
    markAsSeen
};
