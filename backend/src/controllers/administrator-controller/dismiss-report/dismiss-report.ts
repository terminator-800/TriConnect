import { deleteProofRecords, deleteReportRecord } from "./dismiss-report-helper.js";
import { deleteReportInCloudinary } from "./delete-report-folder.js"
import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import logger from "../../../config/logger.js";
import pool from "../../../config/database-connection.js";

interface DismissReportBody {
    report_id: number | string;
}

export const dismissReport = async (
    req: Request<{}, {}, DismissReportBody>,
    res: Response
): Promise<void> => {
    let connection: PoolConnection | undefined;

    try {
        const { report_id } = req.body;

        if (!report_id) {
            res.status(400).json({ error: "Report ID is required" });
            return;
        }

        if (req.user?.role !== "administrator") {
            res.status(403).json({ error: "Access denied: Administrators only" });
            return;
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        await deleteProofRecords(connection, Number(report_id));
        const deleted = await deleteReportRecord(connection, Number(report_id));

        if (!deleted) {
            await connection.rollback();
            connection.release();
            res.status(404).json({ error: "Report not found or already dismissed" });
            return;
        }

        await connection.commit();
        connection.release();

        try {
            await deleteReportInCloudinary(report_id);
            logger.info(`Cloudinary files deleted successfully for report_id: ${report_id}`);
        } catch (cloudError: any) {
            logger.error(`Failed to delete Cloudinary files for report_id: ${report_id}`, { cloudError });
        }

        res.status(200).json({ message: "Report dismissed and files deleted", report_id });
    } catch (error: any) {

        if (connection) {
            try {
                await connection.rollback();
                logger.warn(`Transaction rolled back due to error`, { report_id: req.body.report_id, error });
                connection.release();
                logger.debug(`Database connection released after rollback`);
            } catch (rollbackError: any) {
                logger.error(`Failed to rollback or release connection`, { rollbackError });
            }
        }

        logger.error("Failed to dismiss report at (dismiss-report)", { report_id: req.body.report_id, error });
        res.status(500).json({ error: "Failed to dismiss report" });
    }
};
