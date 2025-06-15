const express = require("express");
const multer = require("multer");
const path = require("path");
const {register, verifyEmail, getJobseekerProfile, uploadRequirements} = require("../controllers/jobseekerController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const { uploadJobseekerFiles } = require("../middleware/UploadFiles")
const router = express.Router();

router.post("/register/jobseeker", validateRegisterInput, register);
router.get("/register/jobseeker/verify", verifyEmail);
router.get("/jobseeker/profile", getJobseekerProfile);
router.post("/jobseeker/upload-requirements", uploadJobseekerFiles , uploadRequirements);

module.exports = router;
