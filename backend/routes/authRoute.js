const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/authController");
const { resendVerification } = require("../controllers/userController/resend-verification")

router.post("/login", login)
router.post("/logout", logout);
router.post("/resend-verification", resendVerification)

module.exports = router;
