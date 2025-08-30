import cloudinary from "../../../config/cloudinary.js";

export async function deleteReportInCloudinary(reportId: number | string) {
  const folderPath = `reports/${reportId}`;

  try {
    await cloudinary.api.delete_resources_by_prefix(folderPath);
    await cloudinary.api.delete_folder(folderPath);
    console.log(`All files under ${folderPath} deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete folder ${folderPath}:`, error);
    throw error;
  }
}
