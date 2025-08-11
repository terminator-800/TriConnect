const { hasSubmittedFeedback, saveFeedback } = require("../../helpers/feedback-helper");
const pool = require("../../config/databaseConnection");

const submitFeedback = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const { message } = req.body;
        const { user_id: userId, role } = req.user;

        if (!message?.trim()) {
            return res.status(400).json({ message: "Feedback message is required." });
        }

        const alreadySubmitted = await hasSubmittedFeedback(connection, userId);
        
        if (alreadySubmitted) {
            return res.status(409).json({ message: "You have already submitted feedback." });
        }

        const feedback = await saveFeedback(connection, userId, role, message);
        await connection.commit();

        return res.status(201).json({
            message: "Feedback submitted successfully!",
            feedback,
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error submitting feedback:", error);
        return res.status(500).json({ message: "Failed to submit feedback." });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { submitFeedback };
