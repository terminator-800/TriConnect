import cloudinary from "../../../config/cloudinary.js";

export async function deleteReportInCloudinary(reportId: number | string) {
  const folderPath = `reports/${reportId}`;

  try {
    await cloudinary.api.delete_resources_by_prefix(folderPath);
    await cloudinary.api.delete_folder(folderPath);
  } catch (error) {
    throw error;
  }
}
