require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dbPromise = require("../config/DatabaseConnection");
const { findUsersEmail, createUsers, uploadUserRequirement, getUserInfo } = require("../service/usersQuery");
const { createBusinessEmployer, uploadBusinessEmployerRequirement } = require("../service/BusinessEmployerQuery")
<<<<<<< HEAD
const { createJobPostWithSubscriptionLogic, getJobPostById, softDeleteJobPostById } = require("../service/jobPostQuery");
const { handleMessageUpload } = require('../service/conversationsQuery');
const { getUserConversations, getMessageHistoryByConversationId, processSeenMessages } = require("../service/messageService");
=======
const { createJobPostWithSubscriptionLogic } = require("../service/JobPostQuery");
const { handleMessageUpload } = require('../service/chat');
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2

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

const updateJobPostStatus = async (req, res) => {
    const db = await dbPromise
    const { jobPostId, status } = req.params;
    const allowedStatuses = ['paused', 'active', 'completed'];
    const normalizedStatus = status.toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
        return res.status(400).json({ error: 'Invalid job post status' });
    }

    try {
        const [result] = await db.query(
            'UPDATE job_post SET jobpost_status = ? WHERE job_post_id = ?',
            [normalizedStatus, jobPostId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Job post not found' });
        }

        res.status(200).json({ message: 'Job post status updated successfully' });
    } catch (error) {
        console.error('Error updating job post status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

const softDeleteJobPost = async (req, res) => {
    const { jobPostId } = req.params;
    console.log('Soft delete triggered for jobPostId:', jobPostId);

    if (isNaN(jobPostId)) {
        return res.status(400).json({ error: 'Invalid job post ID' });
    }

    try {
        const jobPost = await getJobPostById(jobPostId);
        if (!jobPost) {
            return res.status(404).json({ error: 'Job post not found' });
        }
        if (jobPost.jobpost_status === 'deleted') {
            return res.status(400).json({ error: 'Job post is already marked as deleted.' });
        }

        await softDeleteJobPostById(jobPostId);

        return res.status(200).json({ message: 'Job post marked as deleted. Will be removed after 1 month.' });
    } catch (err) {
        console.error('Error soft-deleting job post:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const messageAgency = async (req, res) => {
    const { sender_id, receiver_id, message, job_post_id } = req.body;
    try {
        const sender = await getUserInfo(sender_id);
        if (!sender) {
            return res.status(404).json({ error: 'Sender not found' });
        }

        // 2. Insert job application based on sender role
    //     const db = await dbPromise;
    //     await db.execute(
    //         `INSERT INTO job_applications (job_post_id, applicant_id, role, applied_at)
    //    VALUES (?, ?, ?, NOW())`,
    //         [job_post_id, sender_id, sender.role]
    //     );

        // 3. Handle message
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
}

const unmessagedAgencies = async (req, res) => {
    const employerId = parseInt(req.params.employerId, 10);
    const db = await dbPromise
  if (isNaN(employerId)) {
    return res.status(400).json({ message: "Invalid employer ID." });
  }

  try {
    const [agencies] = await db.execute(`
      SELECT * FROM users
      WHERE role = 'manpower_provider'
      AND user_id NOT IN (
        SELECT 
          CASE 
            WHEN user1_id = ? THEN user2_id 
            ELSE user1_id 
          END AS other_user_id
        FROM conversations
        WHERE user1_id = ? OR user2_id = ?
      )
    `, [employerId, employerId, employerId]);

    res.json(agencies);
  } catch (error) {
    console.error('Error fetching unmessaged agencies:', error);
    res.status(500).json({ message: "Server error." });
  }
}

module.exports = {
    register,
    verifyEmail,
    createJobPost,
    getBusinessEmployerProfile,
    uploadRequirements,
    conversations,
    messageHistory,
    replyMessage,
    markAsSeen,
    updateJobPostStatus,
    softDeleteJobPost,
    messageAgency,
    unmessagedAgencies
};
