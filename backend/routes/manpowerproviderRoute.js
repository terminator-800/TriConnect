const express = require("express");
const { registerUser } = require("../controllers/registerUserController.js")
const { verifyEmail } = require("../controllers/emailVerificationController.js")
const { uploadRequirement } = require("../controllers/uploadUserRequirementController.js")
const { getUserProfile } = require("../controllers/userProfileController.js")
const { createJobPost } = require("../controllers/createJobPostController.js")
const { conversations, messageHistory, replyMessage, markAsSeen } = require("../controllers/messageController.js")
const { apply } = require("../controllers/applyJobPost.js");
const { updateJobPostStatus } = require("../controllers/updateJobPostController.js")
const validateRegisterInput = require("../middleware/validateRegisterInput");
const { uploadManpowerProviderFiles, chatImageUpload, reportUpload } = require("../middleware/UploadFiles")
const { softDeleteJobPost } = require("../controllers/deleteJobPostController.js")
const { appliedJobPost } = require("../controllers/appliedJobPostController.js")
const { authenticate } = require("../middleware/authenticate")
const { reportUser, reportedUsers } = require("../controllers/reportController.js")
const { submitFeedback } = require("../controllers/feedbackController.js");


const router = express.Router();

router.post("/register/manpower-provider", validateRegisterInput, registerUser);
router.get("/manpower-provider/verify", verifyEmail);
router.get("/manpower-provider/profile", authenticate, getUserProfile)
router.post("/manpower-provider/upload-requirements", uploadManpowerProviderFiles, uploadRequirement)
router.post("/manpower-provider/job-post", createJobPost)
router.post("/manpower-provider/applications", chatImageUpload, apply)
router.post("/manpower-provider/messages/send", chatImageUpload, replyMessage);
router.get("/manpower-provider/conversations", conversations)
router.get("/manpower-provider/messages/:conversation_id", messageHistory)
router.post("/manpower-provider/messages/mark-as-seen", markAsSeen);
// router.get("/manpower-provider/job-applications/:user_id", appliedJobPost)
router.patch("/manpower-provider/:jobPostId/:status", updateJobPostStatus)
router.delete("/manpower-provider/delete/jobpost/:jobPostId", softDeleteJobPost)
router.post("/manpower-provider/report-user", authenticate, reportUpload, reportUser);
router.get("/manpower-provider/reported-users", authenticate, reportedUsers)
router.post("/manpower-provider/feedback", authenticate, submitFeedback);

module.exports = router;
