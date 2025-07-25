const dbPromise = require("../config/DatabaseConnection");
const fs = require('fs/promises');
const path = require('path');

const getUserConversations = async (user_id) => {
    const db = await dbPromise;

    const [rows] = await db.query(
       `SELECT conversation_id 
        FROM conversations 
        WHERE user1_id = ? 
        OR user2_id = ?`,
        [user_id, user_id]
    );
    return rows;
};

const getMessageHistoryByConversationId = async (conversation_id) => {
    const db = await dbPromise;

    const [messages] = await db.query(
       `SELECT * FROM messages 
        WHERE conversation_id = ? 
        ORDER BY created_at ASC`,
        [conversation_id]
    );
    return messages;
};

const processSeenMessages = async (messageIds, viewerId) => {
    const db = await dbPromise;

    const placeholders = messageIds.map(() => '?').join(',');

    const [ownedRows] = await db.query(
       `SELECT message_id 
        FROM messages 
        WHERE message_id IN (${placeholders}) 
        AND receiver_id = ?`,
        [...messageIds, viewerId]
    );
    const validMessageIds = ownedRows.map(row => row.message_id);

    if (validMessageIds.length === 0) {
        return { validMessageIds: [], updated: 0, messageDetails: [] };
    }

    const [updateResult] = await db.query(
       `UPDATE messages 
        SET is_read = TRUE, read_at = NOW() 
        WHERE message_id IN (${validMessageIds.map(() => '?').join(',')})`,
        validMessageIds
    );

    const [detailsRows] = await db.query(
       `SELECT message_id, sender_id, conversation_id 
        FROM messages 
        WHERE message_id IN (${validMessageIds.map(() => '?').join(',')})`,
        validMessageIds
    );

    return {
        validMessageIds,
        updated: updateResult.affectedRows,
        messageDetails: detailsRows,
    };
};

module.exports = {
    getUserConversations,
    getMessageHistoryByConversationId,
    processSeenMessages
};