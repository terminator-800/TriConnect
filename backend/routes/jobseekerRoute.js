const express = require("express");
const { register, verifyEmail } = require("../controllers/JobseekerController");
const validateRegisterInput = require("../middleware/validateRegisterInput");
const requireLogin = require("../middleware/RequireLogin");
const router = express.Router();

router.post("/register/jobseeker", validateRegisterInput, register);
router.get("/register/jobseeker/verify", verifyEmail);


module.exports = router;
