require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dbPromise = require("../config/DatabaseConnection");
const { findUsersEmail, createUsers, uploadUserRequirement, getUserInfo } = require("../service/UsersQuery");
const { createBusinessEmployer, uploadBusinessEmployerRequirement } = require("../service/BusinessEmployerQuery")
const { createJobPostWithSubscriptionLogic } = require("../service/JobPostQuery");
const { handleMessageUpload } = require('../service/chat');

const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Account creation failed: Missing email or password",
        });
    }
    try {
        const existingEmployer = await findUsersEmail(email);
        if (existingEmployer) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const verificationLink = `http://localhost:${process.env.PORT}/register/employer/business/verify?token=${token}`;
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
            subject: "Verify your business employer email",
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email and complete registration.</p>`,
        });
        return res.status(201).json({
            message: "Verification email sent. Please check your inbox to complete registration.",
        });
    } catch (error) {
        console.error("Error sending verification email:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, password } = decoded;
        const role = "business_employer";

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await createUsers(email, hashedPassword, role);
        if (!createdUser || !createdUser.user_id) {
            return res.status(500).send("Failed to create user account.");
        }

        const user_id = createdUser.user_id;

        await createBusinessEmployer(user_id, role, email, hashedPassword);

        console.log("Business employer account created successfully!");
        res.send("Email verified and account created successfully!");
    } catch (err) {
        console.error("Verification error:", err);
        res.status(400).send("Invalid or expired verification link.");
    }
};

const createJobPost = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Token not provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { user_id, role } = decoded;

        if (role !== "business_employer") {
            return res.status(403).json({ error: "Only business employers can create job posts." });
        }

        const result = await createJobPostWithSubscriptionLogic({
            user_id,
            role,
            job_title: req.body.job_title,
            job_type: req.body.job_type,
            salary_range: req.body.salary_range,
            location: req.body.location,
            required_skill: req.body.required_skill,
            job_description: req.body.job_description
        });

        if (result.error) {
            return res.status(403).json({ error: result.error });
        }

        res.status(201).json({
            message: "Job post created successfully!",
            job_post_id: result.job_post_id
        });
    } catch (error) {
        console.error("Error creating job post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getBusinessEmployerProfile = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;
        const role = decoded.role;

        if (role !== 'business_employer') {
            return res.status(403).json({ error: 'Forbidden: Not a business employer' });
        }

        const businessEmployerProfile = await getUserInfo(user_id);
        if (!businessEmployerProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.status(200).json(businessEmployerProfile);
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

const uploadRequirements = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { user_id } = decoded;

        const {
            business_name,
            business_address,
            industry,
            business_size,
            authorized_person
        } = req.body;

        const authorized_person_id = req.files?.authorized_person_id?.[0]?.filename || null;
        const business_permit_BIR = req.files?.business_permit_BIR?.[0]?.filename || null;
        const DTI = req.files?.DTI?.[0]?.filename || null;
        const business_establishment = req.files?.business_establishment?.[0]?.filename || null;

        const payload = {
            user_id,
            business_name,
            business_address,
            industry,
            business_size,
            authorized_person,
            authorized_person_id,
            business_permit_BIR,
            DTI,
            business_establishment
        };

        await uploadBusinessEmployerRequirement(payload);
        await uploadUserRequirement(payload);

        return res.status(200).json({ message: "Business employer requirements uploaded successfully" });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(401).json({
            message: "Unauthorized or invalid token",
            error: error.message
        });
    }
};

const conversations = async (req, res) => {
    db = await dbPromise;
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- Decode token using your secret key
        const user_id = decoded.user_id; // <-- Extract user ID from payload

        // console.log("User ID from token:", user_id); // For debugging

        const [rows] = await db.query(
            `SELECT conversation_id FROM conversations WHERE user1_id = ? OR user2_id = ?`,
            [user_id, user_id]
        );
        // console.log("rows: ", rows);

        res.json(rows); // e.g., [{ conversation_id: 1 }, { conversation_id: 2 }]
    } catch (err) {
        console.error("Error fetching conversations:", err);
        res.status(500).json({ error: "Server error or invalid token" });
    }
};

const messageHistory = async (req, res) => {
    const { conversation_id } = req.params;
    console.log(conversation_id);

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

module.exports = { register, verifyEmail, createJobPost, getBusinessEmployerProfile, uploadRequirements, conversations, messageHistory, replyMessage, markAsSeen };
