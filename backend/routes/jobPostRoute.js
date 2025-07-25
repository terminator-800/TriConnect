const express = require("express");
const router = express.Router();
const { 
    approvedJobPosts, 
    unappliedJobPosts, 
    jobPostsByUser
} = require("../controllers/jobPostController")

router.get("/approvedJobPosts", approvedJobPosts)
router.get("/unappliedJobPosts", unappliedJobPosts)
router.get("/jobPosts", jobPostsByUser)

module.exports = router;
