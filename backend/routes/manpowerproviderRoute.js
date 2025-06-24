const express = require("express");
const { register, verifyEmail, getManpowerProviderProfile, uploadRequirements, createJobPost } = require("../controllers/ManpowerProviderController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const { uploadManpowerProviderFiles } = require("../middleware/UploadFiles")
const router = express.Router();

router.post("/register/manpower-provider", validateRegisterInput, register);
router.get("/register/manpower-provider/verify", verifyEmail);
router.get("/manpower-provider/profile", getManpowerProviderProfile)
router.post("/manpower-provider/upload-requirements", uploadManpowerProviderFiles, uploadRequirements)
router.post("/manpower-provider/job-post", createJobPost)

module.exports = router;
