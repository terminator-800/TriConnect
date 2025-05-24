const express = require("express");
const { register, verifyEmail } = require("../controllers/BusinessEmployerController");
const validateRegisterInput = require("../middleware/validateRegisterInput");
const router = express.Router();

router.post("/register/employer/business/account/", validateRegisterInput, register);
router.get("/register/employer/business/verify", verifyEmail);

module.exports = router;