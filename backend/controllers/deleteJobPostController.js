require('dotenv').config();
const { getJobPostById, softDeleteJobPostById } = require("../service/jobPostQuery");

const softDeleteJobPost = async (req, res) => {

    const deleted = 'deleted'

    const { jobPostId } = req.params;

    if (isNaN(jobPostId)) {
        return res.status(400).json({ error: 'Invalid job post ID' });
    }

    try {
        const jobPost = await getJobPostById(jobPostId);

        if (!jobPost) {
            return res.status(404).json({ error: 'Job post not found' });
        }

        if (jobPost.jobpost_status === deleted) {
            return res.status(400).json({ error: 'Job post is already marked as deleted.' });
        }

        await softDeleteJobPostById(jobPostId);

        return res.status(200).json({ message: 'Job post marked as deleted. Will be removed after 1 month.' });
        
    } catch (err) {
        console.error('Error soft-deleting job post:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    softDeleteJobPost
}