import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from 'express';
import type { PoolConnection } from 'mysql2/promise';
import { getJobPostById } from '../../../service/job-post-by-id-service.js';
import { deleteJobPost } from './delete.js';
import pool from '../../../config/database-connection.js';

export const softDeleteJobPost = async (req: Request, res: Response) => {
    const deletedStatus = 'deleted';
    const jobPostId = Number(req.params.jobPostId);

    if (isNaN(jobPostId)) {
        return res.status(400).json({ error: 'Invalid job post ID' });
    }

    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const jobPost = await getJobPostById(connection, jobPostId);

        if (!jobPost) {
            await connection.rollback();
            return res.status(404).json({ error: 'Job post not found' });
        }

        if (jobPost.jobpost_status === deletedStatus) {
            await connection.rollback();
            return res
                .status(400)
                .json({ error: 'Job post is already marked as deleted.' });
        }

        await deleteJobPost(connection, jobPostId);

        await connection.commit();

        return res.status(200).json({
            message: 'Job post marked as deleted. Will be removed after 1 month.',
        });
    } catch (err) {
        if (connection) await connection.rollback();
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
};
