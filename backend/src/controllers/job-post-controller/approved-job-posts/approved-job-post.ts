import type { Request, Response } from "express";
import { getApprovedJobPosts } from "./get-approved-job-posts.js";
import type { PoolConnection } from "mysql2/promise";
import pool from "../../../config/database-connection.js";
import logger from "../../../config/logger.js";

export const approvedJobPosts = async (req: Request, res: Response): Promise<void> => {
    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();

        const jobPosts = await getApprovedJobPosts(connection);

        res.status(200).json(jobPosts);
    } catch (error: any) {
        logger.error("Failed to fetch approved job posts", { error, query: req.query, ip: req.ip });
        res.status(500).json({ error: "Failed to fetch approved job posts" });
    } finally {
        if (connection) {
            try {
                connection.release();
            } catch (error) {
                logger.error("Failed to release DB connection in approvedJobPosts", { error });
            }
        }
    }
};
