const path = require('path');
const fs = require('fs');

// --- Helper Functions (DB and File Handling) ---

/** Fetch all proof file paths for a given report */
async function fetchProofFiles(connection, reportId) {
    const [proofs] = await connection.query(
        `SELECT file_url 
        FROM report_proofs 
        WHERE report_id = ?`,
        [reportId]
    );
    return proofs;
}

/** Delete all proof records for a report */
async function deleteProofRecords(connection, reportId) {
    await connection.query(`
        DELETE 
        FROM report_proofs
         WHERE report_id = ?`, 
         [reportId]);
}

/** Delete the report record itself */
async function deleteReportRecord(connection, reportId) {
    const [result] = await connection.query(
        `DELETE 
        FROM reports 
        WHERE report_id = ?`,
        [reportId]
    );
    return result.affectedRows > 0;
}

/** Delete proof files from disk */
function deleteFiles(proofs) {
    proofs.forEach(({ file_url }) => {
        const relativePath = file_url.replace(/^\/+/, '');
        const filePath = path.join(__dirname, '..', 'uploads', relativePath);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${file_url}`, err);
            } else {
                console.log(`Deleted file: ${file_url}`);
            }
        });
    });
}

/** Delete the report folder (uploads/reports/<report_id>) */
function deleteReportFolder(reportId) {
    const folderPath = path.join(__dirname, '..', 'uploads', 'reports', String(reportId));
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error(`Failed to delete folder: ${folderPath}`, err);
        } else {
            console.log(`Deleted folder: ${folderPath}`);
        }
    });
}

module.exports = {
    fetchProofFiles,
    deleteProofRecords,
    deleteReportRecord,
    deleteFiles,
    deleteReportFolder
};
