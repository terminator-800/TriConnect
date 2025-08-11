const { format, isToday, isThisYear } = require('date-fns');

const getMessageHistoryByConversationId = async (connection, conversation_id) => {
    const [messages] = await connection.query(
        `
    SELECT 
      m.*,

      -- Sender info
      sender.role AS sender_role,
      COALESCE(
        be_sender.authorized_person,
        ie_sender.full_name,
        mp_sender.agency_authorized_person,
        js_sender.full_name
      ) AS sender_name,

      -- Receiver info
      receiver.role AS receiver_role,
      COALESCE(
        be_receiver.authorized_person,
        ie_receiver.full_name,
        mp_receiver.agency_authorized_person,
        js_receiver.full_name
      ) AS receiver_name

    FROM messages m

    -- Sender joins
    JOIN users sender ON m.sender_id = sender.user_id
    LEFT JOIN jobseeker js_sender ON sender.user_id = js_sender.jobseeker_id
    LEFT JOIN individual_employer ie_sender ON sender.user_id = ie_sender.individual_employer_id
    LEFT JOIN business_employer be_sender ON sender.user_id = be_sender.business_employer_id
    LEFT JOIN manpower_provider mp_sender ON sender.user_id = mp_sender.manpower_provider_id

    -- Receiver joins
    JOIN users receiver ON m.receiver_id = receiver.user_id
    LEFT JOIN jobseeker js_receiver ON receiver.user_id = js_receiver.jobseeker_id
    LEFT JOIN individual_employer ie_receiver ON receiver.user_id = ie_receiver.individual_employer_id
    LEFT JOIN business_employer be_receiver ON receiver.user_id = be_receiver.business_employer_id
    LEFT JOIN manpower_provider mp_receiver ON receiver.user_id = mp_receiver.manpower_provider_id

    WHERE m.conversation_id = ?
    ORDER BY m.created_at ASC
    `,
        [conversation_id]
    );

    const formattedMessages = messages.map(msg => {
        const createdAt = new Date(msg.created_at);
        let displayTime;

        if (isToday(createdAt)) {
            displayTime = format(createdAt, 'hh:mm a');
        } else if (isThisYear(createdAt)) {
            displayTime = format(createdAt, 'MMM d');
        } else {
            displayTime = format(createdAt, 'MMM d, yyyy');
        }

        return {
            ...msg,
            created_at: displayTime
        };
    });

    return formattedMessages;
};

module.exports = {
    getMessageHistoryByConversationId
}