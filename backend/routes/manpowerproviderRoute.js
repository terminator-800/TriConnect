const express = require("express");
const { registerUser } = require("../controllers/userController/register-user-account.js")
const { verifyEmail } = require("../controllers/userController/email-verification.js")
const { uploadRequirement } = require("../controllers/userController/upload-user-requirement.js")
const { getUserProfile } = require("../controllers/userController/user-profile.js")
const { createJobPost } = require("../controllers/userController/create-job-post.js")
const { conversations } = require("../controllers/userController/messageController/conversations.js")
const { messageHistory } = require("../controllers/userController/messageController/message-history.js")
const { replyMessage } = require("../controllers/userController/messageController/reply-message.js")
const { markAsSeen } = require("../controllers/userController/messageController/mark-as-seen.js")
const { apply } = require("../controllers/userController/apply-job-post.js");
const { updateJobPostStatus } = require("../controllers/userController/update-jobpost-status.js")
const validateRegisterInput = require("../middleware/validateRegisterInput.js");
const { uploadManpowerProviderFiles, chatImageUpload, reportUpload } = require("../middleware/uploadFiles2.js")
const { softDeleteJobPost } = require("../controllers/userController/delete-job-post.js")
// const { appliedJobPost } = require("../controllers/userController/applied-job-post.js")
const { authenticate } = require("../middleware/authenticate2.js")
const { viewApplicants } = require("../controllers/userController/view-applicants.js");
const { employerDashboard } = require("../controllers/userController/employer-dashboard.js");
const { rejectApplication } = require("../controllers/userController/reject-application.js");
const { reportUser, reportedUsers } = require("../controllers/reportController.js")
const { submitFeedback } = require("../controllers/userController/submit-feedback.js");
const router = express.Router();

router.post("/register/manpower-provider", validateRegisterInput, registerUser);
router.get("/manpower-provider/verify", verifyEmail);
router.get("/manpower-provider/profile", authenticate, getUserProfile)
router.post("/manpower-provider/upload-requirements", uploadManpowerProviderFiles, uploadRequirement)
router.post("/manpower-provider/job-post", authenticate, createJobPost)
router.post("/manpower-provider/applications", authenticate, chatImageUpload, apply)
router.post("/manpower-provider/messages/send", authenticate, chatImageUpload, replyMessage);
router.get("/manpower-provider/conversations", authenticate, conversations)
router.get("/manpower-provider/message-history/:conversation_id", messageHistory)
router.patch("/manpower-provider/mark-as-seen", authenticate, markAsSeen);
// router.get("/manpower-provider/job-applications/:user_id", appliedJobPost)
router.patch("/manpower-provider/:jobPostId/:status", updateJobPostStatus)
router.delete("/manpower-provider/delete/jobpost/:jobPostId", softDeleteJobPost)
router.post("/manpower-provider/report-user", authenticate, reportUpload, reportUser);
router.get("/manpower-provider/reported-users", authenticate, reportedUsers)
router.post("/manpower-provider/feedback", authenticate, submitFeedback);
router.get("/manpower-provider/applicants", authenticate, viewApplicants);
router.get("/manpower-provider/dashboard", authenticate, employerDashboard);
router.patch("/manpower-provider/applications/:applicationId/reject", authenticate, rejectApplication);

module.exports = router;
