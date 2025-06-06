const express = require("express");
const { register, verifyEmail } = require("../controllers/manpowerProviderController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const router = express.Router();

router.post("/register/manpower-provider", validateRegisterInput, register);
router.get("/register/manpower-provider/verify", verifyEmail);

module.exports = router;
