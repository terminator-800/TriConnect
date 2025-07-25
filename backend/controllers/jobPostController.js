const { getApprovedJobPosts, getUnappliedJobPosts, getJobPostsByUserGrouped } = require("../service/jobPostQuery")
const dbPromise = require("../config/DatabaseConnection");

const approvedJobPosts = async (req, res) => {
  try {
    const jobPosts = await getApprovedJobPosts();

    res.json(jobPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch approved job posts' });
  }
};

const unappliedJobPosts = async (req, res) => {
  const applicant_id = req.query.user_id;

  if (!applicant_id) {
    return res.status(400).json({ error: 'Missing applicant_id' });
  }

  try {
    const jobPosts = await getUnappliedJobPosts(applicant_id);
    res.json(jobPosts);
  } catch (err) {
    console.error('Failed to fetch unapplied job posts:', err);
    res.status(500).json({ error: 'Failed to fetch unapplied job posts' });
  }
};

// Employer and Manpower Job Posts
const jobPostsByUser = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id in query" });
  }

  try {
    const posts = await getJobPostsByUserGrouped(user_id);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching job posts:", err);
    res.status(500).json({ message: "Failed to fetch job posts" });
  }
};

module.exports = {
  approvedJobPosts,
  unappliedJobPosts,
  jobPostsByUser
}
