const express = require("express");
const { 
    register, 
    verifyEmail, 
    getManpowerProviderProfile,
    uploadRequirements, 
    createJobPost, 
    apply, 
    replyMessage, 
    conversations,
    messageHistory,
    markAsSeen,
    appliedJobPost,
    updateJobPostStatus,
    softDeleteJobPost 
} = require("../controllers/ManpowerProviderController");
const validateRegisterInput = require("../middleware/validateRegisterInput");
const { uploadManpowerProviderFiles, chatImageUpload } = require("../middleware/uploadFiles")
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
router.get("/manpower-provider/job-applications/:user_id", appliedJobPost)
router.patch("/manpower-provider/:jobPostId/:status", updateJobPostStatus)
router.delete("/manpower-provider/delete/jobpost/:jobPostId", softDeleteJobPost)

module.exports = router;
