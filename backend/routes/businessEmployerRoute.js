const express = require("express");
const { registerUser } = require("../controllers/registerUserController.js")
const { verifyEmail } = require("../controllers/emailVerificationController.js")
const { uploadRequirement } = require("../controllers/uploadUserRequirementController.js")
const { getUserProfile } = require("../controllers/userProfileController.js")
const { createJobPost } = require("../controllers/createJobPostController.js")
const { conversations, messageHistory, replyMessage, markAsSeen } = require("../controllers/messageController.js")
const { updateJobPostStatus } = require("../controllers/updateJobPostController.js")
const { contactAgency } = require("../controllers/contactAgency.js")
const { softDeleteJobPost } = require("../controllers/deleteJobPostController.js")
const { uncontactedAgencies } = require("../controllers/uncontactedAgency.js")
const validateRegisterInput = require("../middleware/validateRegisterInput")
const { uploadBusinessEmployerFiles } = require("../middleware/UploadFiles")
const { reportUser, reportedUsers } = require("../controllers/reportController.js")
const { chatImageUpload, reportUpload } = require("../middleware/UploadFiles")
const { authenticate } = require("../middleware/authenticate");
const { submitFeedback } = require("../controllers/feedbackController.js");
const router = express.Router();

router.post("/register/business-employer", validateRegisterInput, registerUser);
router.get("/business-employer/verify", verifyEmail);
router.get("/business-employer/profile", authenticate, getUserProfile)
router.post("/business-employer/upload-requirements", authenticate, uploadBusinessEmployerFiles, uploadRequirement)
router.post("/business-employer/job-post", authenticate, createJobPost)
router.get("/business-employer/conversations", authenticate, conversations)
router.get("/business-employer/messages/:conversation_id", authenticate, messageHistory)
router.post("/business-employer/messages/send", authenticate, chatImageUpload, replyMessage)
router.post("/business-employer/messages/mark-as-seen", authenticate, markAsSeen);
router.patch("/business-employer/:jobPostId/:status", authenticate, updateJobPostStatus)
router.delete("/business-employer/delete/jobpost/:jobPostId", authenticate, softDeleteJobPost)
router.post("/business-employer/message-agency", authenticate, chatImageUpload, contactAgency)
router.get('/business-employer/uncontacted-agencies', authenticate, uncontactedAgencies)
router.post("/business-employer/report-user", authenticate, reportUpload, reportUser);
router.get("/business-employer/reported-users", authenticate, reportedUsers)
router.post("/business-employer/feedback", authenticate, submitFeedback);

module.exports = router;