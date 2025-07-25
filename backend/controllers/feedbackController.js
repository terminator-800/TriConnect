const { hasSubmittedFeedback, saveFeedback } = require("../utils/feedbackHelper");

const submitFeedback = async (req, res) => {
    try {
        const { message } = req.body;
        const { user_id: userId, role } = req.user;

        if (!message?.trim()) {
            return res.status(400).json({ message: "Feedback message is required." });
        }

        const alreadySubmitted = await hasSubmittedFeedback(userId);
        if (alreadySubmitted) {
            return res.status(409).json({ message: "You have already submitted feedback." });
        }

        const feedback = await saveFeedback(userId, role, message);

        return res.status(201).json({
            message: "Feedback submitted successfully!",
            feedback,
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return res.status(500).json({ message: "Failed to submit feedback." });
    }
};


module.exports = { submitFeedback };
