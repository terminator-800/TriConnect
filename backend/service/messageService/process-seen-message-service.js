const processSeenMessages = async (connection, message_id, viewer_id) => {
    if (!Array.isArray(message_id) || message_id.length === 0) {
        return { validMessageIds: [], updated: 0, messageDetails: [] };
    }

    // STEP 1: Filter messages that the viewer is allowed to mark as seen (viewer must be receiver)
    const placeholders = message_id.map(() => '?').join(',');

    const [ownedRows] = await connection.query(
        `
    SELECT message_id
    FROM messages
    WHERE message_id IN (${placeholders})
      AND receiver_id = ?
    `,
        [...message_id, viewer_id]
    );

    const validMessageIds = ownedRows.map(row => row.message_id);
    if (validMessageIds.length === 0) {
        return { validMessageIds: [], updated: 0, messageDetails: [] };
    }

    // STEP 2: Update `is_read` and `read_at`
    const updatePlaceholders = validMessageIds.map(() => '?').join(',');

    const [updateResult] = await connection.query(
        `
    UPDATE messages
    SET is_read = TRUE,
        read_at = NOW()
    WHERE message_id IN (${updatePlaceholders}) AND is_read = 0
    `,
        validMessageIds
    );


    // STEP 3: Fetch details for response (optional but useful)
    const [detailsRows] = await connection.query(
        `
    SELECT message_id, sender_id, receiver_id, conversation_id, is_read, read_at
    FROM messages
    WHERE message_id IN (${updatePlaceholders})
    `,
        validMessageIds
    );

    return {
        validMessageIds,
        updated: updateResult.affectedRows,
        messageDetails: detailsRows,
    };
};

module.exports = {
    processSeenMessages
}