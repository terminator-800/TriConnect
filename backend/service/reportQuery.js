const path = require("path");
const fs = require("fs");

async function findExistingReport (db, reportedBy, reportedUserId) {
  const [existing] = await db.query(
    `SELECT 1 FROM reports WHERE reported_by = ? AND reported_user_id = ?`,
    [reportedBy, reportedUserId]
  );
  return existing;
};

// Insert a new report and return its ID
async function insertNewReport (db, reportedBy, reportedUserId, reason, message, conversationId) {
  const [result] = await db.query(
    `INSERT INTO reports (reported_by, reported_user_id, reason, message, conversation_id)
     VALUES (?, ?, ?, ?, ?)`,
    [reportedBy, reportedUserId, reason, message || null, conversationId || null]
  );
  return result.insertId;
};

// Reported Users
async function getReportedUsersBy (db, reportedBy) {
  const [rows] = await db.execute(
    "SELECT reported_user_id FROM reports WHERE reported_by = ?",
    [reportedBy]
  );
  return rows.map((r) => r.reported_user_id);
};

async function moveFilesAndInsertToDB(files, tempPath, finalPath, reportId, db) {
  fs.mkdirSync(finalPath, { recursive: true });

  for (const file of files) {
    const oldPath = path.join(tempPath, file.filename);
    const newPath = path.join(finalPath, file.filename);

    // Move the file
    fs.renameSync(oldPath, newPath);

    const ext = path.extname(file.originalname).toLowerCase();
    let fileType = 'file'; 

    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      fileType = 'image';
    } else if (ext !== '.pdf') {
      console.warn(`Skipping unsupported file type: ${ext}`);
      continue;
    }

    const relativePath = path.join('reports', `${reportId}`, file.filename).replace(/\\/g, '/');

    // Insert into DB
    await db.query(
      `INSERT INTO report_proofs (report_id, file_url, file_type) VALUES (?, ?, ?)`,
      [reportId, relativePath, fileType]
    );
  }
}

module.exports = {
  findExistingReport,
  insertNewReport,
  getReportedUsersBy,
  moveFilesAndInsertToDB
};
