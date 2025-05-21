const express = require("express");
const register  = require("../controllers/BusinessEmployerController");
const router = express.Router();

router.post("/employer/business/register", register);

module.exports = router;
