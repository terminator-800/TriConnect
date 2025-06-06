const express = require("express");
const { register, verifyEmail } = require("../controllers/individualEmployerController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const router = express.Router();

router.post("/register/employer/individual/account", validateRegisterInput, register);
router.get("/register/employer/individual/verify", verifyEmail);

module.exports = router;
