const express = require("express");
const { forgotPassword, resetPassword } = require("../controllers/forgotPasswordController");
const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/reset-password", resetPassword);

module.exports = router;