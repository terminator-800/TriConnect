const express = require("express");
const { 
    fetchUser, 
    submittedUsers,
    verifyUser, 
    rejectUser, 
    pendingJobPosts,
    // fetchJobPost, 
    rejectJobpost, 
    approveJobpost, 
    createAdminIfNotExists,
    verifiedUsers,
    verifiedJobPosts,
    allReportedUsers,
    restrictUser,
    dismissReport,
    userFeedbacks
}  = require("../controllers/administratorController")
const { getUserProfile } = require("../controllers/userProfileController")
const { authenticate } = require("../middleware/authenticate")
const router = express.Router();

router.post("/administrator/", createAdminIfNotExists)
router.get("/administrator/profile", authenticate, getUserProfile)
router.get("/fetch/", fetchUser)
router.get("/administrator/submittedUsers", authenticate, submittedUsers)
// router.get("/administrator/jobPosts", fetchJobPost)
router.get("/administrator/pendingJobPosts", authenticate, pendingJobPosts)
router.put("/administrator/verify/user/:user_id", authenticate, verifyUser);
router.put("/administrator/reject/user/:user_id", authenticate, rejectUser)
router.put("/administrator/reject/jobpost/:job_post_id", authenticate, rejectJobpost)
router.patch("/administrator/approve/jobpost/:job_post_id", authenticate, approveJobpost)
router.get("/administrator/verifiedUsers", verifiedUsers)
router.get("/administrator/verifiedJobPosts", verifiedJobPosts)
router.get("/administrator/all-reported-users", authenticate, allReportedUsers)
router.post("/administrator/restrict-user", authenticate, restrictUser)
router.post("/administrator/dismiss-report", authenticate, dismissReport)
router.get("/administrator/user-feedbacks", authenticate, userFeedbacks)

module.exports = router;