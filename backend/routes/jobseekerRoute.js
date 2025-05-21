const express = require("express");
const register  = require("../controllers/JobseekerController");
const router = express.Router();

router.post("/jobseeker", register);

module.exports = router;
