const express = require("express");
const { register, verifyEmail, getJobseekerProfile, uploadRequirements, apply, conversations, messageHistory, replyMessage, markAsSeen,  } = require("../controllers/jobseekerController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const { uploadJobseekerFiles, chatImageUpload } = require("../middleware/UploadFiles")
const router = express.Router();

router.post("/register/jobseeker", validateRegisterInput, register);
router.get("/register/jobseeker/verify", verifyEmail);
router.get("/jobseeker/profile", getJobseekerProfile);
router.post("/jobseeker/upload-requirements", uploadJobseekerFiles , uploadRequirements);
router.post("/jobseeker/applications", chatImageUpload, apply)
router.get("/jobseeker/conversations", conversations)
router.get("/jobseeker/messages/:conversation_id", messageHistory)
router.post("/jobseeker/messages/send", chatImageUpload, replyMessage);
router.post("/jobseeker/messages/mark-as-seen", markAsSeen);

module.exports = router;
