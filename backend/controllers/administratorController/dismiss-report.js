const pool = require("../../config/databaseConnection2");
const { fetchProofFiles, deleteProofRecords, deleteReportRecord, deleteFiles, deleteReportFolder } = require("../../helpers/dismiss-report-helper");

const dismissReport = async (req, res) => {
    let connection;

    try {
        const { report_id } = req.body;

        if (!report_id) {
            return res.status(400).json({ error: 'Report ID is required' });
        }

        if (req.user?.role !== 'administrator') {
            return res.status(403).json({ error: 'Access denied: Administrators only' });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const proofs = await fetchProofFiles(connection, report_id);

        await deleteProofRecords(connection, report_id);
        const deleted = await deleteReportRecord(connection, report_id);

        if (!deleted) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ error: 'Report not found or already dismissed' });
        }

        await connection.commit();
        connection.release();

        deleteFiles(proofs);
        deleteReportFolder(report_id);

        res.status(200).json({ message: 'Report dismissed and files deleted', report_id });
    } catch (error) {
        console.error('Error dismissing report:', error);

        if (connection) {
            await connection.rollback();
            connection.release();
        }

        res.status(500).json({ error: 'Failed to dismiss report' });
    }
};

module.exports = {
    dismissReport
}
