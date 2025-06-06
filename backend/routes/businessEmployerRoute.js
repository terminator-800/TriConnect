const express = require("express");
const { register, verifyEmail } = require("../controllers/businessEmployerController");
const validateRegisterInput = require("../middleware/ValidateRegisterInput")
const router = express.Router();

router.post("/register/employer/business/account/", validateRegisterInput, register);
router.get("/register/employer/business/verify", verifyEmail);

module.exports = router;