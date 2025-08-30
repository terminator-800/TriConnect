import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import pool from "../../../config/database-connection.js";
import { hasSubmittedFeedback, saveFeedback } from "./feedback-helper.js";
import type { AuthenticatedUser } from "../../../middleware/authenticate.js";

interface FeedbackRequestBody {
    message: string;
}

interface FeedbackRequest extends Request {
    user?: AuthenticatedUser;
    body: FeedbackRequestBody;
}

export const submitFeedback = async (req: FeedbackRequest, res: Response): Promise<Response> => {
    let connection: PoolConnection | undefined;

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const { message } = req.body;
        const { user_id: userId, role } = req.user;

        if (!message?.trim()) {
            return res.status(400).json({ message: "Feedback message is required." });
        }

        const alreadySubmitted: boolean = await hasSubmittedFeedback(connection, userId);

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
