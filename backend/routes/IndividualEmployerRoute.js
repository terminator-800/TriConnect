const express = require("express");
const { register, verifyEmail, getIndividualEmployerProfile, uploadRequirements, createJobPost, replyMessage, conversations, messageHistory, markAsSeen } = require("../controllers/IndividualEmployerController");
const { uploadIndividualEmployerFiles } = require("../middleware/UploadFiles")
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const { chatImageUpload } = require("../middleware/UploadFiles");
const router = express.Router();

router.post("/register/employer/individual/account", validateRegisterInput, register);
router.get("/register/employer/individual/verify", verifyEmail);
router.get("/individual-employer/profile", getIndividualEmployerProfile)
router.post("/individual-employer/upload-requirements", uploadIndividualEmployerFiles, uploadRequirements)
router.post("/individual-employer/job-post", createJobPost)
router.get("/individual-employer/conversations", conversations)
router.get("/individual-employer/messages/:conversation_id", messageHistory)
router.post("/individual-employer/messages/send", chatImageUpload, replyMessage)
router.post("/individual-employer/messages/mark-as-seen", markAsSeen);

module.exports = router;
