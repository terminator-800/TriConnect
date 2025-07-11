const express = require("express");
<<<<<<< HEAD
const { 
    register, 
    verifyEmail, 
    getJobseekerProfile, 
    uploadRequirements, 
    apply, conversations, 
    messageHistory, 
    replyMessage, 
    markAsSeen, 
    appliedJobPost 
} = require("../controllers/jobseekerController");
const validateRegisterInput = require("../middleware/validateRegisterInput");
const { uploadJobseekerFiles, chatImageUpload } = require("../middleware/uploadFiles")
=======
const { register, verifyEmail, getJobseekerProfile, uploadRequirements, apply, conversations, messageHistory, replyMessage, markAsSeen,  } = require("../controllers/jobseekerController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const { uploadJobseekerFiles, chatImageUpload } = require("../middleware/UploadFiles")
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2
const router = express.Router();

router.post("/register/jobseeker", validateRegisterInput, register);
router.get("/register/jobseeker/verify", verifyEmail);
router.get("/jobseeker/profile", getJobseekerProfile);
router.post("/jobseeker/upload-requirements", uploadJobseekerFiles , uploadRequirements);
router.post("/jobseeker/applications", chatImageUpload, apply)
router.get("/jobseeker/conversations", conversations)
router.get("/jobseeker/messages/:conversation_id", messageHistory)
router.post("/jobseeker/messages/send", chatImageUpload, replyMessage);
router.post("/jobseeker/messages/mark-as-seen", markAsSeen);
<<<<<<< HEAD
router.get("/jobseeker/job-applications/:user_id", appliedJobPost)
=======
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2

module.exports = router;
