import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import { processSeenMessages } from "./process-seen-message.js";
import pool from "../../../../config/database-connection.js";

// Use the globally augmented user type
export interface MessageDetail {
  message_id: number;
  sender_id: string;
  conversation_id: number;
}

interface SenderToMessages {
  [senderId: string]: {
    conversation_id: number;
    message_ids: number[];
  };
}

export const markAsSeen = async (req: Request, res: Response) => {
  let connection: PoolConnection | undefined;
  const viewer_id = req.user?.user_id;

  if (!viewer_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { message_id } = req.body as { message_id: number[] };

  if (!Array.isArray(message_id) || message_id.length === 0) {
    return res.status(400).json({ error: "Invalid message_ids" });
  }

  try {
    connection = await pool.getConnection();

    const { validMessageIds, updated, messageDetails } =
      await processSeenMessages(connection, message_id, viewer_id);

    if (validMessageIds.length === 0) {
      return res.status(403).json({ error: "No messages belong to the viewer" });
    }

    const senderToMessages: SenderToMessages = {};

    for (const msg of messageDetails) {
      const senderId = msg?.sender_id;
      if (!senderId) continue;

      if (!senderToMessages[senderId]) {
        senderToMessages[senderId] = {
          conversation_id: msg.conversation_id,
          message_ids: [],
        };
      }
      senderToMessages[senderId].message_ids.push(msg.message_id);
    }

    const io = req.app.get("io");
    const userSocketMap: Record<string, string> = req.app.get("userSocketMap");

    for (const [senderId, data] of Object.entries(senderToMessages)) {
      const senderSocketId = userSocketMap[senderId];
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", data);
      }
    }

    return res.json({
      success: true,
      updated,
      seenMessageIds: validMessageIds,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
};
