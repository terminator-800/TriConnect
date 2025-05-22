const express = require("express");
const register  = require("../controllers/IndividualEmployerController");
const router = express.Router();

router.post("/account", register);

module.exports = router;
