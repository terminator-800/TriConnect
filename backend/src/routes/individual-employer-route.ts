// const express = require("express");
// const { conversations } = require("../controllers/userController/messageController/conversations.js")
// const { messageHistory } = require("../controllers/userController/messageController/message-history.js")
// const { replyMessage } = require("../controllers/userController/messageController/reply-message.js")
// const { markAsSeen } = require("../controllers/userController/messageController/mark-as-seen.js")
// const { registerUser } = require("../controllers/userController/register-user-account.js")
// const { verifyEmail } = require("../controllers/userController/email-verification.js")
// const { uploadRequirement } = require("../controllers/userController/upload-user-requirement.js")
// const { getUserProfile } = require("../controllers/userController/user-profile.js")
// const { createJobPost } = require("../controllers/userController/create-job-post.js")
// const { updateJobPostStatus } = require("../controllers/userController/update-jobpost-status.js")
// const { uploadIndividualEmployerFiles } = require("../middleware/uploadFiles2.js")
// const validateRegisterInput = require("../middleware/validateRegisterInput.js");
// const { chatImageUpload, reportUpload } = require("../middleware/uploadFiles2.js");
// const { contactAgency } = require("../controllers/userController/contact-agency.js")
// const { softDeleteJobPost } = require("../controllers/userController/delete-job-post.js")
// const { uncontactedAgencies } = require("../controllers/userController/uncontacted-agency.js")
// const { authenticate } = require("../middleware/authenticate2.js")
// const { reportUser, reportedUsers } = require("../controllers/reportController.js")
// const { submitFeedback } = require("../controllers/userController/submit-feedback.js");
// const { viewApplicants } = require("../controllers/userController/view-applicants.js");
// const { employerDashboard } = require("../controllers/userController/employer-dashboard.js");
// const { rejectApplication } = require("../controllers/userController/reject-application.js");


import express from "express";
import { registerUser } from "../controllers/userController/register/register-user-account.js";
import { verifyEmail } from "../controllers/userController/email-verification/email-verification.js";
import { uploadRequirement } from "../controllers/userController/upload-requirement/upload-user-requirement.js"
import { getUserProfile } from "../controllers/userController/user-profile/user-profile.js";
import { createJobPost } from "../controllers/userController/create-job-post/create-job-post.js";
import { conversations } from "../controllers/userController/messageController/conversation/conversations.js";
import { messageHistory } from "../controllers/userController/messageController/history/message-history.js"
import { replyMessage } from "../controllers/userController/messageController/reply/reply-message.js"
import { markAsSeen } from "../controllers/userController/messageController/seen/mark-as-seen.js";
import { updateJobPostStatus } from "../controllers/userController/job-post-status/update-jobpost-status.js";
import { contactAgency } from "../controllers/../controllers/userController/contact-agent/contact-agency.js";
import { softDeleteJobPost } from "../controllers/userController/delete-job-post/delete-job-post.js";
import { uncontactedAgencies } from "../controllers/userController/uncontacted-agent/uncontacted-agency.js";
import { validateRegisterInput } from "../middleware/validate-register-input.js";
import { uploadIndividualEmployerFiles } from "../middleware/upload-files.js";
import { reportedUsers } from "../controllers/report-controller/reported-user/reported-user.js";
import { reportUser  } from "../controllers/report-controller/report-user/report-user.js";
import { chatImageUpload, reportUpload } from "../middleware/upload-files.js";
import { authenticate } from "../middleware/authenticate.js";
import { submitFeedback } from "../controllers/userController/submit-feedback/submit-feedback.js";
import { viewApplicants } from "../controllers/userController/view-applicant/view-applicants.js";
import { employerDashboard } from "../controllers/userController/employer-dashboard.js";
import { rejectApplication } from "../controllers/userController/reject-application/reject-application.js";

const router = express.Router();

router.post("/register/individual-employer", validateRegisterInput, registerUser);
router.get("/individual-employer/verify", verifyEmail);
router.get("/individual-employer/profile", authenticate, getUserProfile)
router.post("/individual-employer/upload-requirements", authenticate, uploadIndividualEmployerFiles, uploadRequirement)
router.post("/individual-employer/job-post", authenticate, createJobPost)
router.get("/individual-employer/conversations", authenticate, conversations)
router.get("/individual-employer/message-history/:conversation_id", authenticate, messageHistory)
router.post("/individual-employer/messages/send", authenticate, chatImageUpload, replyMessage)
router.patch("/individual-employer/mark-as-seen", authenticate, markAsSeen);
router.patch("/individual-employer/:jobPostId/:status", authenticate, updateJobPostStatus)
router.delete("/individual-employer/delete/jobpost/:jobPostId", authenticate, softDeleteJobPost)
router.post("/individual-employer/message-agency", authenticate, chatImageUpload, contactAgency)
router.get('/individual-employer/uncontacted-agencies', authenticate, uncontactedAgencies)
router.post("/individual-employer/report-user", authenticate, reportUpload, reportUser);
router.get("/individual-employer/reported-users", authenticate, reportedUsers)
router.post("/individual-employer/feedback", authenticate, submitFeedback);
router.get("/individual-employer/applicants", authenticate, viewApplicants);
router.get("/individual-employer/dashboard", authenticate, employerDashboard);
router.patch("/individual-employer/applications/:applicationId/reject", authenticate, rejectApplication);

export default router;