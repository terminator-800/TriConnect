import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the temporary folder path for report uploads.
 * @param tempFolderId - The temporary folder identifier
 * @returns Absolute path to the temporary folder
 */
export function getTempPath(tempFolderId: string | number): string {
  return path.join(__dirname, "../../../../", "uploads", "reports", `temp-${tempFolderId}`);
}

/**
 * Get the final folder path for a submitted report.
 * @param reportId - The report ID
 * @returns Absolute path to the final report folder
 */
export function getFinalPath(reportId: number | string): string {
  return path.join(__dirname, "../../../../", "uploads", "reports", String(reportId));
}

/**
 * Delete a folder if it exists. Logs a warning if the folder is not empty.
 * @param folderPath - Absolute path to the folder
 */
export function deleteFolderIfExists(folderPath: string): void {
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
