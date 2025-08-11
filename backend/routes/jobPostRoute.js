const express = require("express");
const { approvedJobPosts } = require("../controllers/jobPostController/approved-job-post");
const { unappliedJobPosts } = require("../controllers/jobPostController/unnapplied-job-post");
const { jobPostsByUser } = require("../controllers/jobPostController/job-post-by-user")
const { authenticate } = require("../middleware/authenticate2");
const router = express.Router();

router.get("/approvedJobPosts", authenticate, approvedJobPosts)
router.get("/unappliedJobPosts", authenticate, unappliedJobPosts)
router.get("/jobPosts", authenticate, jobPostsByUser)

module.exports = router;
