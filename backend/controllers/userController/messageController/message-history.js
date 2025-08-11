const pool = require("../../../config/databaseConnection2");
const { getMessageHistoryByConversationId } = require("../../../service/messageService/get-message-history-service");

const messageHistory = async (req, res) => {
  let connection;

  const { conversation_id } = req.params;

  try {

    connection = await pool.getConnection();

    const messages = await getMessageHistoryByConversationId(connection, conversation_id);

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
    messageHistory
}