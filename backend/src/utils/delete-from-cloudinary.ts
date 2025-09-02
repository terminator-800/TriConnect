import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error("Failed to delete file from Cloudinary.");
  }
};
