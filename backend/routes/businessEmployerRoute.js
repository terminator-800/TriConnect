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
const { updateJobPostStatus } = require("../controllers/userController/update-jobpost-status.js")
const { contactAgency } = require("../controllers/userController/contact-agency.js")
const { softDeleteJobPost } = require("../controllers/userController/delete-job-post.js")
const { uncontactedAgencies } = require("../controllers/userController/uncontacted-agency.js")
const validateRegisterInput = require("../middleware/validateRegisterInput")
const { uploadBusinessEmployerFiles } = require("../middleware/UploadFiles")
const { reportUser, reportedUsers } = require("../controllers/reportController.js")
const { chatImageUpload, reportUpload } = require("../middleware/UploadFiles")
const { authenticate } = require("../middleware/authenticate");
const { submitFeedback } = require("../controllers/userController/submit-feedback.js");
const { viewApplicants } = require("../controllers/userController/view-applicants.js");
const { employerDashboard } = require("../controllers/userController/employer-dashboard.js");
const { rejectApplication } = require("../controllers/userController/reject-application.js");
const router = express.Router();

router.post("/register/business-employer", validateRegisterInput, registerUser);
router.get("/business-employer/verify", verifyEmail);
router.get("/business-employer/profile", authenticate, getUserProfile)
router.post("/business-employer/upload-requirements", authenticate, uploadBusinessEmployerFiles, uploadRequirement)
router.post("/business-employer/job-post", authenticate, createJobPost)
router.get("/business-employer/conversations", authenticate, conversations)
router.get("/business-employer/message-history/:conversation_id", authenticate, messageHistory)
router.post("/business-employer/messages/send", authenticate, chatImageUpload, replyMessage)
router.patch("/business-employer/mark-as-seen", authenticate, markAsSeen);
router.patch("/business-employer/:jobPostId/:status", authenticate, updateJobPostStatus)
router.delete("/business-employer/delete/jobpost/:jobPostId", authenticate, softDeleteJobPost)
router.post("/business-employer/message-agency", authenticate, chatImageUpload, contactAgency)
router.get('/business-employer/uncontacted-agencies', authenticate, uncontactedAgencies)
router.post("/business-employer/report-user", authenticate, reportUpload, reportUser);
router.get("/business-employer/reported-users", authenticate, reportedUsers)
router.post("/business-employer/feedback", authenticate, submitFeedback);
router.get("/business-employer/applicants", authenticate, viewApplicants);
router.get("/business-employer/dashboard", authenticate, employerDashboard);
router.patch("/business-employer/applications/:applicationId/reject", authenticate, rejectApplication);

module.exports = router;