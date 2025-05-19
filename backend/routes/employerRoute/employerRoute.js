const express = require("express");
const register  = require("../../controllers/employerController");
const router = express.Router();

router.post("/employer", register);

module.exports = router;
