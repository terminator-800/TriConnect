const express = require("express");
const { register, verifyEmail } = require("../controllers/ManpowerProviderController");
const validateRegisterInput = require("../middleware/validateRegisterInput");
const router = express.Router();

router.post("/register/manpower-provider", validateRegisterInput, register);
router.get("/register/manpower-provider/verify", verifyEmail);

module.exports = router;
