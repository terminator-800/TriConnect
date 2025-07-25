const express = require("express");
const { registerUser } = require("../controllers/registerUserController.js")
const { verifyEmail } = require("../controllers/emailVerificationController.js")
const { uploadRequirement } = require("../controllers/uploadUserRequirementController.js")
const { getUserProfile } = require("../controllers/userProfileController.js")
const { conversations, messageHistory, replyMessage, markAsSeen } = require("../controllers/messageController.js")
const { apply } = require("../controllers/applyJobPost.js")
const { uncontactedAgencies } = require("../controllers/uncontactedAgency.js")
const { contactAgency } = require("../controllers/contactAgency.js")
const { appliedJobPost } = require("../controllers/appliedJobPostController.js")
const { authenticate } = require("../middleware/authenticate")
const { reportUser, reportedUsers } = require("../controllers/reportController.js")
const { submitFeedback } = require("../controllers/feedbackController.js");

const validateRegisterInput = require("../middleware/validateRegisterInput");
const { uploadJobseekerFiles, chatImageUpload, reportUpload } = require("../middleware/UploadFiles")
const router = express.Router();

router.post("/register/jobseeker", validateRegisterInput, registerUser);
router.get("/jobseeker/verify", verifyEmail);
router.get("/jobseeker/profile", authenticate, getUserProfile);
router.post("/jobseeker/upload-requirements", authenticate, uploadJobseekerFiles , uploadRequirement);
router.post("/jobseeker/applications", authenticate, chatImageUpload, apply)
router.get("/jobseeker/conversations", authenticate, conversations)
router.get("/jobseeker/messages/:conversation_id", authenticate, messageHistory)
router.post("/jobseeker/messages/send", authenticate, chatImageUpload, replyMessage);
router.post("/jobseeker/messages/mark-as-seen", authenticate, markAsSeen);
// router.get("/jobseeker/job-applications/:user_id", appliedJobPost);
router.post("/jobseeker/message-agency", authenticate, chatImageUpload, contactAgency)
router.get('/jobseeker/uncontacted-agencies', authenticate, uncontactedAgencies);
router.post("/jobseeker/report-user", authenticate, reportUpload, reportUser);
router.get("/jobseeker/reported-users", authenticate, reportedUsers)
router.post("/jobseeker/feedback", authenticate, submitFeedback);

module.exports = router;
