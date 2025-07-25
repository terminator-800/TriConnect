const express = require("express");
const { conversations, messageHistory, replyMessage, markAsSeen } = require("../controllers/messageController.js")
const { registerUser } = require("../controllers/registerUserController.js")
const { verifyEmail } = require("../controllers/emailVerificationController.js")
const { uploadRequirement } = require("../controllers/uploadUserRequirementController.js")
const { getUserProfile } = require("../controllers/userProfileController.js")
const { createJobPost } = require("../controllers/createJobPostController.js")
const { updateJobPostStatus } = require("../controllers/updateJobPostController.js")
const { uploadIndividualEmployerFiles } = require("../middleware/UploadFiles")
const validateRegisterInput = require("../middleware/validateRegisterInput");
const { chatImageUpload, reportUpload } = require("../middleware/UploadFiles");
const { contactAgency } = require("../controllers/contactAgency.js")
const { softDeleteJobPost } = require("../controllers/deleteJobPostController.js")
const { uncontactedAgencies } = require("../controllers/uncontactedAgency.js")
const { authenticate } = require("../middleware/authenticate")
const { reportUser, reportedUsers } = require("../controllers/reportController.js")
const { submitFeedback } = require("../controllers/feedbackController.js");

const router = express.Router();

router.post("/register/individual-employer", validateRegisterInput, registerUser);
router.get("/individual-employer/verify", verifyEmail);
router.get("/individual-employer/profile", authenticate, getUserProfile)
router.post("/individual-employer/upload-requirements", authenticate, uploadIndividualEmployerFiles, uploadRequirement)
router.post("/individual-employer/job-post", authenticate, createJobPost)
router.get("/individual-employer/conversations", authenticate, conversations)
router.get("/individual-employer/messages/:conversation_id", authenticate, messageHistory)
router.post("/individual-employer/messages/send", authenticate, chatImageUpload, replyMessage)
router.post("/individual-employer/messages/mark-as-seen", authenticate, markAsSeen);
router.patch("/individual-employer/:jobPostId/:status", authenticate, updateJobPostStatus)
router.delete("/individual-employer/delete/jobpost/:jobPostId", authenticate, softDeleteJobPost)
router.post("/individual-employer/message-agency", authenticate, chatImageUpload, contactAgency)
router.get('/individual-employer/uncontacted-agencies', authenticate, uncontactedAgencies)
router.post("/individual-employer/report-user", authenticate, reportUpload, reportUser);
router.get("/individual-employer/reported-users", authenticate, reportedUsers)
router.post("/individual-employer/feedback", authenticate, submitFeedback);

module.exports = router;
