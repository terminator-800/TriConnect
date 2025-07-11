const express = require("express");
const { 
    register, 
    verifyEmail, 
    createJobPost, 
    getBusinessEmployerProfile, 
    conversations, 
    messageHistory, 
    replyMessage, 
    markAsSeen, 
    updateJobPostStatus,
    softDeleteJobPost,
    messageAgency,
    unmessagedAgencies
} = require("../controllers/BusinessEmployerController");
const validateRegisterInput = require("../middleware/validateRegisterInput")
const { uploadBusinessEmployerFiles } = require("../middleware/uploadFiles")
const { uploadRequirements } = require("../controllers/BusinessEmployerController");
const { chatImageUpload } = require("../middleware/uploadFiles")
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
router.patch("/business-employer/:jobPostId/:status", updateJobPostStatus)
router.delete("/business-employer/delete/jobpost/:jobPostId", softDeleteJobPost)
router.post("/business-employer/message-agency", chatImageUpload, messageAgency)
router.get('/business-employer/unmessaged-agencies/:employerId', unmessagedAgencies)

module.exports = router;