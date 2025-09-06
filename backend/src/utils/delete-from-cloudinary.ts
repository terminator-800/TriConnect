import cloudinary from "../config/cloudinary.js";
import logger from "../config/logger.js";

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Successfully deleted Cloudinary file: ${publicId}`, { result });

    return result;
  } catch (error) {
    logger.error(`Failed to delete Cloudinary file: ${publicId}`, { error });
    throw new Error("Failed to delete file from Cloudinary.");
  }
};
