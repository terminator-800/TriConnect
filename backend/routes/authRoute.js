const express = require("express");
const router = express.Router();
const { verifySession } = require("../controllers/authController");

router.get("/auth/verify-session", verifySession);

module.exports = router;