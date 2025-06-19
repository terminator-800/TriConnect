const express = require("express");
const { fetchUser, verifyUser, rejectUser }  = require("../controllers/adminController")
const router = express.Router();

router.get("/admin/fetch", fetchUser)
router.put("/admin/verify/:user_id", verifyUser);
router.put("/admin/reject/:user_id", rejectUser)
module.exports = router;