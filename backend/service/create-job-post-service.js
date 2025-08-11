const { countActiveJobPosts, insertJobPost, validateJobPostInput } = require("../helpers/create-job-post-helper")

async function createJobPosts(connection, jobPostData) {
    const validation = validateJobPostInput(jobPostData);
    if (validation.error) return { error: validation.error };

    const { user_id } = jobPostData;
    const maxAllowed = 3;

    try {
        const totalPosts = await countActiveJobPosts(connection, user_id);

        if (totalPosts >= maxAllowed) {
            return {
                error: `You can only create up to ${maxAllowed} active job posts.`
            };
        }

        const job_post_id = await insertJobPost(connection, jobPostData);

        return {
            success: true,
            job_post_id,
            message: "Job post created successfully."
        };
    } catch (error) {
        return { error: "Database error occurred.", details: error.message };
    }
}

module.exports = {
    createJobPosts
}