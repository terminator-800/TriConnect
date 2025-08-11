const express = require("express");
const { createAdministrator } = require("../controllers/administratorController/create-administrator");
const { submittedUsers } = require("../controllers/administratorController/submitted-users");
const { pendingJobPosts } = require("../controllers/administratorController/pending-job-posts");
const { verifyUser } = require("../controllers/administratorController/verify-user");
const { rejectUser } = require("../controllers/administratorController/reject-user");
const { rejectJobPost } = require("../controllers/administratorController/reject-job-post");
const { approveJobPost } = require("../controllers/administratorController/approve-job-post");
const { verifiedUsers } = require("../controllers/administratorController/verified-users");
const { verifiedJobPosts } = require("../controllers/administratorController/verified-job-posts");
const { reportedUsers } = require("../controllers/administratorController/reported-users");
const { restrictUser } = require("../controllers/administratorController/restrict-user");
const { dismissReport } = require("../controllers/administratorController/dismiss-report");
const { usersFeedbacks } = require("../controllers/administratorController/users-feedbacks");
const { getUserProfile } = require("../controllers/userController/user-profile")
const { authenticate } = require("../middleware/authenticate2")
const router = express.Router();

router.post("/administrator/", createAdministrator)
router.get("/administrator/profile", authenticate, getUserProfile)
router.get("/administrator/submittedUsers", authenticate, submittedUsers)
router.get("/administrator/pendingJobPosts", authenticate, pendingJobPosts)
router.put("/administrator/verify/user/:user_id", authenticate, verifyUser);
router.put("/administrator/reject/user/:user_id", authenticate, rejectUser)
router.put("/administrator/reject/jobpost/:job_post_id", authenticate, rejectJobPost)
router.patch("/administrator/approve/jobpost/:job_post_id", authenticate, approveJobPost)
router.get("/administrator/verifiedUsers", authenticate, verifiedUsers)
router.get("/administrator/verifiedJobPosts", authenticate, verifiedJobPosts)
router.get("/administrator/all-reported-users", authenticate, reportedUsers)
router.post("/administrator/restrict-user", authenticate, restrictUser)
router.post("/administrator/dismiss-report", authenticate, dismissReport)
router.get("/administrator/user-feedbacks", authenticate, usersFeedbacks)

module.exports = router;