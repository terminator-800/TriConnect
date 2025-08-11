const express = require("express");
const { registerUser } = require("../controllers/userController/register-user-account.js")
const { verifyEmail } = require("../controllers/userController/email-verification.js")
const { uploadRequirement } = require("../controllers/userController/upload-user-requirement.js")
const { getUserProfile } = require("../controllers/userController/user-profile.js")
const { conversations } = require("../controllers/userController/messageController/conversations.js")
const { messageHistory } = require("../controllers/userController/messageController/message-history.js")
const { replyMessage } = require("../controllers/userController/messageController/reply-message.js")
const { markAsSeen } = require("../controllers/userController/messageController/mark-as-seen.js")
const { apply } = require("../controllers/userController/apply-job-post.js")
const { uncontactedAgencies } = require("../controllers/userController/uncontacted-agency.js")
const { contactAgency } = require("../controllers/userController/contact-agency.js")
// const { appliedJobPost } = require("../controllers/userController/applied-job-post.js")
const { authenticate } = require("../middleware/authenticate2.js")
const { reportUser, reportedUsers } = require("../controllers/reportController.js")
const { submitFeedback } = require("../controllers/userController/submit-feedback.js");
const validateRegisterInput = require("../middleware/validateRegisterInput.js");
const { uploadJobseekerFiles, chatImageUpload, reportUpload } = require("../middleware/uploadFiles2.js")
const router = express.Router();

router.post("/register/jobseeker", validateRegisterInput, registerUser);
router.get("/jobseeker/verify", verifyEmail);
router.get("/jobseeker/profile", authenticate, getUserProfile);
router.post("/jobseeker/upload-requirements", authenticate, uploadJobseekerFiles, uploadRequirement);
router.post("/jobseeker/applications", authenticate, chatImageUpload, apply)
router.get("/jobseeker/conversations", authenticate, conversations)
router.get("/jobseeker/message-history/:conversation_id", authenticate, messageHistory)
router.post("/jobseeker/messages/send", authenticate, chatImageUpload, replyMessage);
router.patch("/jobseeker/mark-as-seen", authenticate, markAsSeen);
// router.get("/jobseeker/job-applications/:user_id", appliedJobPost);
router.post("/jobseeker/message-agency", authenticate, chatImageUpload, contactAgency)
router.get('/jobseeker/uncontacted-agencies', authenticate, uncontactedAgencies);
router.post("/jobseeker/report-user", authenticate, reportUpload, reportUser);
router.get("/jobseeker/reported-users", authenticate, reportedUsers)
router.post("/jobseeker/feedback", authenticate, submitFeedback);

module.exports = router;
