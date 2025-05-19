const express = require("express");
const register  = require("../../controllers/jobseekerController");
const router = express.Router();

router.post("/jobseeker", register);

module.exports = router;
