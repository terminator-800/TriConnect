const express = require("express");
const { register, verifyEmail } = require("../controllers/ManpowerProviderController");
const validateRegisterInput = require("../middleware/validateRegisterInput");
const router = express.Router();

router.post("/register/manpowerProvider", validateRegisterInput, register);
router.get("/register/manpowerProvider/verify", verifyEmail);

module.exports = router;
