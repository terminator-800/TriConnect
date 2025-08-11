const path = require("path");
const fs = require("fs");

function getTempPath(tempFolderId) {
  return path.join(__dirname, "..", "uploads", "reports", `temp-${tempFolderId}`);
}

function getFinalPath(reportId) {
  return path.join(__dirname, "..", "uploads", "reports", String(reportId));
}

function deleteFolderIfExists(folderPath) {
  if (fs.existsSync(folderPath)) {
    const contents = fs.readdirSync(folderPath);
    if (contents.length > 0) {
      console.warn(`⚠️ Folder not empty. Contents:`, contents);
    }

    fs.rmSync(folderPath, { recursive: true, force: true });

    if (!fs.existsSync(folderPath)) {
      console.log(`✅ Folder deleted: ${folderPath}`);
    } else {
      console.warn(`❌ Folder still exists after deletion attempt: ${folderPath}`);
    }
  } else {
    console.warn(`⚠️ Folder not found: ${folderPath}`);
  }
}

module.exports = {
  getTempPath,
  getFinalPath,
  deleteFolderIfExists,
};
