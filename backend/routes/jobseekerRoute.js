const express = require("express");
const register  = require("../controllers/JobseekerController");
const validateRegisterInput = require("../middleware/validateRegisterInput");
const router = express.Router();

router.post("/jobseeker", validateRegisterInput, register);

module.exports = router;
