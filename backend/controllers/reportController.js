const dbPromise = require("../config/DatabaseConnection");
const { moveFilesAndInsertToDB } = require("../service/reportQuery")

const {
  getTempPath,
  getFinalPath,
  deleteFolderIfExists,
} = require("../utils/reportFileHelpers");

const {
  findExistingReport,
  insertNewReport,
  getReportedUsersBy,
} = require("../service/reportQuery");

const reportUser = async (req, res) => {
  const db = await dbPromise;

  try {
    const { reason, message, reportedUserId, conversationId } = req.body;
    const reportedBy = req.user?.user_id;
    const files = req.files || [];
    const tempFolderId = req.tempFolderId;

    // Validate required fields
    if (!reportedBy || !reportedUserId || !reason) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const tempPath = getTempPath(tempFolderId);

    // Prevent duplicate report by same user on same target
    const existing = await findExistingReport(db, reportedBy, reportedUserId);
    if (existing.length > 0) {
      deleteFolderIfExists(tempPath); 
      return res.status(409).json({ error: 'You have already reported this user.' });
    }

    // Insert new report entry
    const reportId = await insertNewReport(
      db,
      reportedBy,
      reportedUserId,
      reason,
      message,
      conversationId
    );

    const finalPath = getFinalPath(reportId); 

    await moveFilesAndInsertToDB(files, tempPath, finalPath, reportId, db);

    // Remove temporary folder after move
    deleteFolderIfExists(tempPath);

    res.status(200).json({ message: 'Report submitted successfully.' });
  } catch (error) {
    console.error('❌ Report submission failed:', error);
    res.status(500).json({ error: 'Failed to submit report.' });
  }
};

const reportedUsers = async (req, res) => {
  const db = await dbPromise;
  const reportedBy = req.user?.user_id;

  if (!reportedBy) {
    return res.status(400).json({ error: "User ID missing in token." });
  }

  try {
    const reportedIds = await getReportedUsersBy(db, reportedBy);
    res.status(200).json(reportedIds);
  } catch (error) {
    console.error("Error fetching reported users:", error);
    res.status(500).json({ error: "Failed to fetch reported users." });
  }
};

module.exports = { reportUser, reportedUsers };
