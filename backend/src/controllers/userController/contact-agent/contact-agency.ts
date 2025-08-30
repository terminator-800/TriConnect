import type { Request, Response, RequestHandler } from "express";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import type { AuthenticatedUser } from "../../../middleware/authenticate.js";
import { handleMessageUpload } from "../../../service/handle-message-upload-service.js";
import { uploadToCloudinary } from "../../../utils/upload-to-cloudinary.js";
import pool from "../../../config/database-connection.js";
import fs from "fs";

interface FileUpload {
    path: string;
}

interface ContactAgencyRequest extends Request {
    user?: AuthenticatedUser;
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
}

interface HandleMessageUploadParams {
    sender_id: number;
    receiver_id: number;
    message?: string;
    files: FileUpload[] | undefined;
}

export const contactAgency: RequestHandler = async (request: Request, res: Response) => {
    const r = request as ContactAgencyRequest;
    const sender_id = r.user?.user_id;
    const { receiver_id, message } = request.body as { receiver_id: number; message: string };

    if (!sender_id || !receiver_id || !message) {
        return res.status(400).json({ error: "Missing sender_id, receiver_id, or message" });
    }

    let connection: PoolConnection | undefined;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Upload files to Cloudinary
        let uploadedFiles: FileUpload[] | undefined = undefined;
        if (r.files && r.files.length > 0) {
            uploadedFiles = [];
            for (const f of r.files) {
                const url = await uploadToCloudinary(f.path, "message_agency");
                uploadedFiles.push({ path: url });
            }
        } else if (r.file) {
            const url = await uploadToCloudinary(r.file.path, "message_agency");
            uploadedFiles = [{ path: url }];
        }

        if (r.files) {
            r.files.forEach(f => fs.unlinkSync(f.path));
        } else if (r.file) {
            fs.unlinkSync(r.file.path);
        }

        const params: HandleMessageUploadParams = {
            sender_id,
            receiver_id,
            message,
            files: uploadedFiles,
        };

        const newMessage = (await handleMessageUpload(connection, params)) as RowDataPacket;

        if (!newMessage?.conversation_id) {
            await connection.rollback();
            return res.status(400).json({ error: "Message upload failed or missing conversation_id" });
        }

        await connection.commit();

        // Add metadata
        newMessage.created_at = new Date().toISOString();
        newMessage.is_read = false;

        const roomId = newMessage.conversation_id;

        // Socket handling
        const io = request.app.get("io") as { to: (room: string) => { emit: (event: string, data: any) => void } };
        const userSocketMap = request.app.get("userSocketMap") as Record<number | string, string>;

        io.to(roomId.toString()).emit("receiveMessage", newMessage);

        const receiverSocketId = userSocketMap?.[receiver_id];
        if (receiverSocketId) io.to(receiverSocketId).emit("receiveMessage", newMessage);

        return res.status(201).json({
            message: "Application sent and message stored",
            conversation_id: newMessage.conversation_id,
            file_url: newMessage.file_url,
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("❌ Error during agency contact:", error);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        if (connection) connection.release();
    }
};
