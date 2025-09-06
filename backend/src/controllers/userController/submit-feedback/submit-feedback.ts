import { hasSubmittedFeedback, saveFeedback } from "./feedback-helper.js";
import type { AuthenticatedUser } from "../../../middleware/authenticate.js";
import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import { ROLE } from "../../../utils/roles.js";
import logger from "../../../config/logger.js";
import pool from "../../../config/database-connection.js";

interface FeedbackRequestBody {
    message: string;
}

interface FeedbackRequest extends Request {
    user?: AuthenticatedUser;
    body: FeedbackRequestBody;
}

const allowedRoles: typeof ROLE[keyof typeof ROLE][] = [
    ROLE.BUSINESS_EMPLOYER,
    ROLE.INDIVIDUAL_EMPLOYER,
    ROLE.MANPOWER_PROVIDER,
    ROLE.JOBSEEKER
];

export const submitFeedback = async (req: FeedbackRequest, res: Response): Promise<Response> => {
    let connection: PoolConnection | undefined;
    const ip = req.ip;
    const user = req.user;

    if (!user) {
        logger.warn("Unauthorized feedback attempt", { ip });
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { user_id: user_id, role } = user;

    if (!allowedRoles.includes(role)) {
        logger.warn("Unauthorized role tried to submit a feedback", { ip, role, user_id });
        return res.status(403).json({ error: "Forbidden: Only authorized users can submit a feedback." });
    }

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const { message } = req.body;

        if (!message?.trim()) {
            logger.warn("Empty feedback message submitted", { user_id, role, ip });
            return res.status(400).json({ message: "Feedback message is required." });
        }

        const alreadySubmitted: boolean = await hasSubmittedFeedback(connection, user_id);

        if (alreadySubmitted) {
            return res.status(409).json({ message: "You have already submitted feedback." });
        }

        const feedback = await saveFeedback(connection, user_id, role, message);
        await connection.commit();

        return res.status(201).json({
            message: "Feedback submitted successfully!",
            feedback,
        });
    } catch (error) {
        logger.error("Failed to submit feedback", { error, user: req.user, ip });
        if (connection) {
            try {
                await connection.rollback();
            } catch (error) {
                logger.error("Failed to rollback transaction on feedback submission", { error, user: req.user, ip });
            }
        }
        return res.status(500).json({ message: "Failed to submit feedback." });
    } finally {
        if (connection) {
            try {
                connection.release();
            } catch (releaseError) {
                logger.error("Failed to release DB connection after feedback submission", { releaseError, user: req.user, ip });
            }
        }
    }
};
