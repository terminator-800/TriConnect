const { moveFilesAndInsertToDB } = require("../service/report-service")
const pool = require("../config/databaseConnection");

const {
  getTempPath,
  getFinalPath,
  deleteFolderIfExists,
} = require("../helpers/report-file-helpers");

const {
  findExistingReport,
  insertNewReport,
  getReportedUsersBy,
} = require("../service/report-service");

const reportUser = async (req, res) => {
        let connection;

        try {
          connection = await pool.getConnection();
          await connection.beginTransaction();

          const { reason, message, reportedUserId, conversationId } = req.body;
          console.log(req.body, 'request body');
          
          const reportedBy = req.user?.user_id;
          const files = req.files || [];
          const tempFolderId = req.tempFolderId;

          // Validate required fields
          if (!reportedBy || !reportedUserId || !reason) {
            return res.status(400).json({ error: 'Missing required fields.' });
          }

          const tempPath = getTempPath(tempFolderId);

          const existing = await findExistingReport(connection, reportedBy, reportedUserId);

          if (existing.length > 0) {
            deleteFolderIfExists(tempPath);
            return res.status(409).json({ error: 'You have already reported this user.' });
          }

          // Insert new report entry
          const reportId = await insertNewReport(
            connection,
            reportedBy,
            reportedUserId,
            reason,
            message,
            conversationId
          );

          const finalPath = getFinalPath(reportId);

          await moveFilesAndInsertToDB(files, tempPath, finalPath, reportId, connection);

          deleteFolderIfExists(tempPath);

          await connection.commit();

          res.status(200).json({ message: 'Report submitted successfully.' });
        } catch (error) {

          if (connection) await connection.rollback()
          console.error('❌ Report submission failed:', error);

          res.status(500).json({ error: 'Failed to submit report.' });

        } finally {
          if (connection) connection.release();
        }
};

const reportedUsers = async (req, res) => {
        let connection;
        const reportedBy = req.user?.user_id;

        if (!reportedBy) {
          return res.status(400).json({ error: "User ID missing in token." });
        }

        try {
          connection = await pool.getConnection();

          const reportedIds = await getReportedUsersBy(connection, reportedBy);
          res.status(200).json(reportedIds);
        } catch (error) {
          console.error("Error fetching reported users:", error);
          res.status(500).json({ error: "Failed to fetch reported users." });

        } finally {
          if (connection) connection.release();
        }
};

module.exports = { reportUser, reportedUsers };
