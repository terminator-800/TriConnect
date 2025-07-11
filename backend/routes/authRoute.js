const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { login, logout } = require("../controllers/authController");

router.post("/login", login)
router.post("/logout", logout);
=======
const { verifyToken } = require("../controllers/authController");

router.get("/auth/verify-token", verifyToken);
>>>>>>> 5c24e1cab43e9ce3fdca97914d13bcb6c735a7c2

module.exports = router;
