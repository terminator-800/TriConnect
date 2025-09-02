import cloudinary from "../config/cloudinary.js"

export const uploadToCloudinary = async (filePath: string, folder: string = "user_requirements") => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder
        });
        return result.secure_url;
    } catch (error) {
        throw new Error(`Failed to upload file to Cloudinary.`);
    }
};
