const express = require("express");
const { register, verifyEmail, createJobPost, getBusinessEmployerProfile } = require("../controllers/BusinessEmployerController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput")
const { uploadBusinessEmployerFiles } = require("../middleware/UploadFiles")
const authenticate = require("../middleware/Authenticate"); // Correct import for authentication middleware
const { uploadRequirements } = require("../controllers/BusinessEmployerController");

const router = express.Router();

router.post("/register/employer/business/account/", validateRegisterInput, register);
router.get("/register/employer/business/verify", verifyEmail);
router.get("/business-employer/profile", getBusinessEmployerProfile)
router.post("/business-employer/upload-requirements", uploadBusinessEmployerFiles, uploadRequirements)
router.post("/job-post", createJobPost)

module.exports = router;