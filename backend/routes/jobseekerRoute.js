const express = require("express");
const { register, verifyEmail, getJobseekerProfile } = require("../controllers/jobseekerController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput");

const router = express.Router();

router.post("/register/jobseeker", validateRegisterInput, register);
router.get("/register/jobseeker/verify", verifyEmail);
router.get("/jobseeker/profile", getJobseekerProfile)
module.exports = router;
