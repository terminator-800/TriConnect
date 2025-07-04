const express = require("express");
const { register, verifyEmail, getManpowerProviderProfile, uploadRequirements, createJobPost, apply, replyMessage, conversations, messageHistory, markAsSeen } = require("../controllers/ManpowerProviderController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const { uploadManpowerProviderFiles, chatImageUpload } = require("../middleware/UploadFiles")
const router = express.Router();

router.post("/register/manpower-provider", validateRegisterInput, register);
router.get("/register/manpower-provider/verify", verifyEmail);
router.get("/manpower-provider/profile", getManpowerProviderProfile)
router.post("/manpower-provider/upload-requirements", uploadManpowerProviderFiles, uploadRequirements)
router.post("/manpower-provider/job-post", createJobPost)
router.post("/manpower-provider/applications", chatImageUpload, apply)
router.post("/manpower-provider/messages/send", chatImageUpload, replyMessage);
router.get("/manpower-provider/conversations", conversations)
router.get("/manpower-provider/messages/:conversation_id", messageHistory)
router.post("/manpower-provider/messages/mark-as-seen", markAsSeen);

module.exports = router;
