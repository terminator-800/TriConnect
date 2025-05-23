const express = require("express");
const { register, verifyEmail } = require("../controllers/BusinessEmployerController");
const validateRegisterInput = require("../middleware/validateRegisterInput");
const router = express.Router();

router.post("/account", validateRegisterInput, register);
router.get("/verify", verifyEmail);

module.exports = router;