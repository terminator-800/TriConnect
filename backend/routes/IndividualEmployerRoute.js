const express = require("express");
<<<<<<< HEAD
const { 
    register, 
    verifyEmail, 
    getIndividualEmployerProfile, 
    uploadRequirements, 
    createJobPost, 
    replyMessage, 
    conversations, 
    messageHistory, 
    markAsSeen ,
    updateJobPostStatus,
    softDeleteJobPost,
    messageAgency,
    unmessagedAgencies
} = require("../controllers/IndividualEmployerController");
const { uploadIndividualEmployerFiles } = require("../middleware/uploadFiles")
const validateRegisterInput = require("../middleware/validateRegisterInput");
const { chatImageUpload } = require("../middleware/uploadFiles");
=======
const { register, verifyEmail, getIndividualEmployerProfile, uploadRequirements, createJobPost, replyMessage, conversations, messageHistory, markAsSeen } = require("../controllers/IndividualEmployerController");
const { uploadIndividualEmployerFiles } = require("../middleware/UploadFiles")
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const { chatImageUpload } = require("../middleware/UploadFiles");
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2
const router = express.Router();

router.post("/register/employer/individual/account", validateRegisterInput, register);
router.get("/register/employer/individual/verify", verifyEmail);
router.get("/individual-employer/profile", getIndividualEmployerProfile)
router.post("/individual-employer/upload-requirements", uploadIndividualEmployerFiles, uploadRequirements)
router.post("/individual-employer/job-post", createJobPost)
router.get("/individual-employer/conversations", conversations)
router.get("/individual-employer/messages/:conversation_id", messageHistory)
router.post("/individual-employer/messages/send", chatImageUpload, replyMessage)
router.post("/individual-employer/messages/mark-as-seen", markAsSeen);
<<<<<<< HEAD
router.patch("/individual-employer/:jobPostId/:status", updateJobPostStatus)
router.delete("/individual-employer/delete/jobpost/:jobPostId", softDeleteJobPost)
router.post("/individual-employer/message-agency", chatImageUpload, messageAgency)
router.get('/individual-employer/unmessaged-agencies/:employerId', unmessagedAgencies)
=======
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2

module.exports = router;
