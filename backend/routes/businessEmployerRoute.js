const express = require("express");
const { register, verifyEmail, createJobPost } = require("../controllers/businessEmployerController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput")
const authenticate = require("../middleware/Authenticate"); // Correct import for authentication middleware

const router = express.Router();

router.post("/register/employer/business/account/", validateRegisterInput, register);
router.get("/register/employer/business/verify", verifyEmail);
router.post("/job-post", createJobPost)

module.exports = router;