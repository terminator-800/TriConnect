const express = require("express");
const { register, verifyEmail, createJobPost, getBusinessEmployerProfile, conversations, messageHistory, replyMessage, markAsSeen } = require("../controllers/BusinessEmployerController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput")
const { uploadBusinessEmployerFiles } = require("../middleware/UploadFiles")
const { uploadRequirements } = require("../controllers/BusinessEmployerController");
const { chatImageUpload } = require("../middleware/UploadFiles")

const router = express.Router();

router.post("/register/employer/business/account/", validateRegisterInput, register);
router.get("/register/employer/business/verify", verifyEmail);
router.get("/business-employer/profile", getBusinessEmployerProfile)
router.post("/business-employer/upload-requirements", uploadBusinessEmployerFiles, uploadRequirements)
router.post("/business-employer/job-post", createJobPost)
router.get("/business-employer/conversations", conversations)
router.get("/business-employer/messages/:conversation_id", messageHistory)
router.post("/business-employer/messages/send", chatImageUpload, replyMessage)
router.post("/business-employer/messages/mark-as-seen", markAsSeen);

module.exports = router;