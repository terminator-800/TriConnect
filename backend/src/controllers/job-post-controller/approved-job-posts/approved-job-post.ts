import type { Request, Response } from "express";
import { getApprovedJobPosts } from "./get-approved-job-posts.js";
import type { PoolConnection } from "mysql2/promise";
import pool from "../../../config/database-connection.js";

export const approvedJobPosts = async (req: Request, res: Response): Promise<void> => {
    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();

        // Strongly typed: getApprovedJobPosts should return a typed array
        const jobPosts = await getApprovedJobPosts(connection);

        res.status(200).json(jobPosts);
    } catch (error: any) {
        console.error("❌ Failed to fetch approved job posts:", error);
        res.status(500).json({ error: "Failed to fetch approved job posts" });
    } finally {
        if (connection) connection.release();
    }
};
