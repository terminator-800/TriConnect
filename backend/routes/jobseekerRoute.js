const express = require("express");
const { 
    register, 
    verifyEmail, 
    getJobseekerProfile, 
    uploadRequirements, 
    apply, conversations, 
    messageHistory, 
    replyMessage, 
    markAsSeen, 
    appliedJobPost 
} = require("../controllers/jobseekerController");
const validateRegisterInput = require("../middleware/validateRegisterInput");
const { uploadJobseekerFiles, chatImageUpload } = require("../middleware/uploadFiles")
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
router.get("/jobseeker/job-applications/:user_id", appliedJobPost)

module.exports = router;
