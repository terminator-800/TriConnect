const express = require("express");
const { fetchUser, verifyUser, rejectUser, fetchJobPost, rejectJobpost, approveJobpost }  = require("../controllers/adminController")
const router = express.Router();

router.get("/fetch", fetchUser)
router.get("/jobposts", fetchJobPost)
router.put("/admin/verify/user/:user_id", verifyUser);
router.put("/admin/reject/user/:user_id", rejectUser)
router.put("/admin/reject/jobpost/:job_post_id", rejectJobpost)
router.patch("/admin/approve/jobpost/:job_post_id", approveJobpost)

module.exports = router;