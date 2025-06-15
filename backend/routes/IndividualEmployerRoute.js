const express = require("express");
const { register, verifyEmail, getIndividualEmployerProfile, uploadRequirements} = require("../controllers/IndividualEmployerController");
const { uploadIndividualEmployerFiles } = require("../middleware/UploadFiles")
const validateRegisterInput = require("../middleware/ValidateRegisterInput");
const router = express.Router();

router.post("/register/employer/individual/account", validateRegisterInput, register);
router.get("/register/employer/individual/verify", verifyEmail);
router.get("/individual-employer/profile", getIndividualEmployerProfile)
router.post("/individual-employer/upload-requirements", uploadIndividualEmployerFiles, uploadRequirements)
module.exports = router;
