// const { format, isToday, isThisYear } = require('date-fns');

// const getUserConversations = async (connection, user_id) => {
//     try {
//         const [rows] = await connection.query(
//             `
//             WITH latest_messages AS (
//                 SELECT *
//                 FROM (
//                     SELECT 
//                         *, 
//                         ROW_NUMBER() OVER (
//                             PARTITION BY conversation_id 
//                             ORDER BY created_at DESC, message_id DESC
//                         ) AS rn
//                     FROM messages
//                 ) ranked
//                 WHERE rn = 1
//             )

//             SELECT 
//                 c.conversation_id,
//                 u.user_id AS sender_id,
//                 u.role,

//                 js.full_name AS js_full_name,
//                 ie.full_name AS ie_full_name,
//                 be.business_name,
//                 mp.agency_name,

//                 be.authorized_person AS authorized_person,
//                 mp.agency_authorized_person AS agency_authorized_person,

//                 m.message_id,
//                 m.message_type,
//                 LEFT(IFNULL(m.message_text, ''), 30) AS message_text,
//                 SUBSTRING_INDEX(m.file_url, '/', -1) AS file_name,
//                 m.created_at AS sent_at

//             FROM conversations c
//             JOIN users u ON u.user_id = IF(c.user1_id = ?, c.user2_id, c.user1_id)

//             LEFT JOIN jobseeker js ON js.jobseeker_id = u.user_id
//             LEFT JOIN individual_employer ie ON ie.individual_employer_id = u.user_id
//             LEFT JOIN business_employer be ON be.business_employer_id = u.user_id
//             LEFT JOIN manpower_provider mp ON mp.manpower_provider_id = u.user_id

//             LEFT JOIN latest_messages m ON m.conversation_id = c.conversation_id

//             WHERE c.user1_id = ? OR c.user2_id = ?
//             ORDER BY m.created_at DESC
//             `,
//             [user_id, user_id, user_id]
//         );

//         const formatted = rows.map((row) => {
//             const preview =
//                 row.message_type === 'file'
//                     ? `${row.file_name || ''}`
//                     : row.message_text || 'No message';

//             const base = {
//                 conversation_id: row.conversation_id,
//                 sender_id: row.sender_id,
//                 role: row.role,
//                 message_text: preview,
//                 sent_at: row.sent_at
//                     ? format(new Date(row.sent_at), "'at' h:mm a")
//                     : null,
//             };

//             if (row.role === 'jobseeker') {
//                 return {
//                     ...base,
//                     full_name: row.js_full_name,
//                 };
//             }

//             if (row.role === 'individual-employer') {
//                 return {
//                     ...base,
//                     full_name: row.ie_full_name,
//                 };
//             }

//             if (row.role === 'business-employer') {
//                 return {
//                     ...base,
//                     business_name: row.business_name,
//                     authorized_person: row.authorized_person,
//                 };
//             }

//             if (row.role === 'manpower-provider') {
//                 return {
//                     ...base,
//                     agency_name: row.agency_name,
//                     agency_authorized_person: row.agency_authorized_person,
//                 };
//             }

//             return {
//                 ...base,
//                 name: 'Unknown',
//             };
//         });

//         return formatted;
//     } catch (error) {
//         console.error('Error fetching user conversations:', error);
//         throw error;
//     }
// };



// const getMessageHistoryByConversationId = async (connection, conversation_id) => {
//     const [messages] = await connection.query(
//         `
//     SELECT 
//       m.*,

//       -- Sender info
//       sender.role AS sender_role,
//       COALESCE(
//         be_sender.authorized_person,
//         ie_sender.full_name,
//         mp_sender.agency_authorized_person,
//         js_sender.full_name
//       ) AS sender_name,

//       -- Receiver info
//       receiver.role AS receiver_role,
//       COALESCE(
//         be_receiver.authorized_person,
//         ie_receiver.full_name,
//         mp_receiver.agency_authorized_person,
//         js_receiver.full_name
//       ) AS receiver_name

//     FROM messages m

//     -- Sender joins
//     JOIN users sender ON m.sender_id = sender.user_id
//     LEFT JOIN jobseeker js_sender ON sender.user_id = js_sender.jobseeker_id
//     LEFT JOIN individual_employer ie_sender ON sender.user_id = ie_sender.individual_employer_id
//     LEFT JOIN business_employer be_sender ON sender.user_id = be_sender.business_employer_id
//     LEFT JOIN manpower_provider mp_sender ON sender.user_id = mp_sender.manpower_provider_id

//     -- Receiver joins
//     JOIN users receiver ON m.receiver_id = receiver.user_id
//     LEFT JOIN jobseeker js_receiver ON receiver.user_id = js_receiver.jobseeker_id
//     LEFT JOIN individual_employer ie_receiver ON receiver.user_id = ie_receiver.individual_employer_id
//     LEFT JOIN business_employer be_receiver ON receiver.user_id = be_receiver.business_employer_id
//     LEFT JOIN manpower_provider mp_receiver ON receiver.user_id = mp_receiver.manpower_provider_id

//     WHERE m.conversation_id = ?
//     ORDER BY m.created_at ASC
//     `,
//         [conversation_id]
//     );

//     const formattedMessages = messages.map(msg => {
//         const createdAt = new Date(msg.created_at);
//         let displayTime;

//         if (isToday(createdAt)) {
//             displayTime = format(createdAt, 'hh:mm a');
//         } else if (isThisYear(createdAt)) {
//             displayTime = format(createdAt, 'MMM d');
//         } else {
//             displayTime = format(createdAt, 'MMM d, yyyy');
//         }

//         return {
//             ...msg,
//             created_at: displayTime
//         };
//     });

//     return formattedMessages;
// };

// const processSeenMessages = async (connection, message_id, viewer_id) => {
//     if (!Array.isArray(message_id) || message_id.length === 0) {
//         return { validMessageIds: [], updated: 0, messageDetails: [] };
//     }

//     // STEP 1: Filter messages that the viewer is allowed to mark as seen (viewer must be receiver)
//     const placeholders = message_id.map(() => '?').join(',');

//     const [ownedRows] = await connection.query(
//         `
//     SELECT message_id
//     FROM messages
//     WHERE message_id IN (${placeholders})
//       AND receiver_id = ?
//     `,
//         [...message_id, viewer_id]
//     );

//     const validMessageIds = ownedRows.map(row => row.message_id);
//     if (validMessageIds.length === 0) {
//         return { validMessageIds: [], updated: 0, messageDetails: [] };
//     }

//     // STEP 2: Update `is_read` and `read_at`
//     const updatePlaceholders = validMessageIds.map(() => '?').join(',');

//     const [updateResult] = await connection.query(
//         `
//     UPDATE messages
//     SET is_read = TRUE,
//         read_at = NOW()
//     WHERE message_id IN (${updatePlaceholders}) AND is_read = 0
//     `,
//         validMessageIds
//     );


//     // STEP 3: Fetch details for response (optional but useful)
//     const [detailsRows] = await connection.query(
//         `
//     SELECT message_id, sender_id, receiver_id, conversation_id, is_read, read_at
//     FROM messages
//     WHERE message_id IN (${updatePlaceholders})
//     `,
//         validMessageIds
//     );

//     return {
//         validMessageIds,
//         updated: updateResult.affectedRows,
//         messageDetails: detailsRows,
//     };
// };

// module.exports = {
    // getUserConversations,
    // getMessageHistoryByConversationId,
    // processSeenMessages
// };