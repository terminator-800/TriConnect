import cloudinary from "../config/cloudinary.js"
import logger from "../config/logger.js";

export const uploadToCloudinary = async (filePath: string, folder: string = "user_requirements") => {
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder });
        logger.info(`File uploaded to Cloudinary: ${filePath}`, { folder, url: result.secure_url });
        return result.secure_url;
    } catch (error: unknown) {
        logger.error(`Failed to upload file to Cloudinary: ${filePath}`, { folder, error });
        throw new Error(`Failed to upload file to Cloudinary.`);
    }
};
