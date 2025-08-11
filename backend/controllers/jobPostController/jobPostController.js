// const pool = require("../../config/DatabaseConnection");
// const { getApprovedJobPosts, getUnappliedJobPosts, getJobPostsByUserGrouped } = require("../../service/jobPostQuery");
// const { ROLE } = require("../../utils/roles");

// // const approvedJobPosts = async (req, res) => {
// //   try {
// //     const jobPosts = await getApprovedJobPosts();

// //     res.json(jobPosts);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to fetch approved job posts' });
// //   }
// // };

// // const unappliedJobPosts = async (req, res) => {
// //   try {
// //     const applicant_id = req.user?.user_id;
// //     const role = req.user?.role;

// //     if (!applicant_id || !role) {
// //       return res.status(401).json({ error: 'Unauthorized: Invalid user token or role' });
// //     }

// //     // Restrict to jobseeker and manpower_provider only
// //     if (role !== ROLE.JOBSEEKER && role !== ROLE.MANPOWER_PROVIDER) {
// //       return res.status(403).json({ error: 'Forbidden: Only jobseekers and manpower providers can access this endpoint' });
// //     }

// //     if (process.env.NODE_ENV !== 'production') {
// //       console.log('applicant id:', applicant_id, '| role:', role);
// //     }

// //     const jobPosts = await getUnappliedJobPosts(pool, applicant_id);
// //     res.status(200).json(jobPosts);
// //   } catch (err) {
// //     console.error('Failed to fetch unapplied job posts:', err);
// //     res.status(500).json({ error: 'Failed to fetch unapplied job posts' });
// //   }
// // };

// const jobPostsByUser = async (req, res) => {
//   const user_id = req.user?.user_id;

//   if (!user_id) {
//     return res.status(401).json({ message: "Unauthorized: User not authenticated" });
//   }

//   try {
//     const posts = await getJobPostsByUserGrouped(pool, user_id);
//     res.status(200).json(posts);
//   } catch (err) {
//     console.error("❌ Error fetching job posts:", err);
//     res.status(500).json({ message: "Failed to fetch job posts" });
//   }
// };


// module.exports = {
//   approvedJobPosts,
//   unappliedJobPosts,
//   jobPostsByUser
// }
