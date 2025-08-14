const { format } = require("date-fns");

const getUserConversations = async (connection, user_id) => {
    try {
        const [rows] = await connection.query(
            `
            SELECT 
                c.conversation_id,
                u.user_id AS sender_id,
                u.role,

                js.full_name AS js_full_name,
                ie.full_name AS ie_full_name,
                be.business_name,
                mp.agency_name,

                be.authorized_person AS authorized_person,
                mp.agency_authorized_person AS agency_authorized_person,

                m.message_id,
                m.message_type,
                LEFT(IFNULL(m.message_text, ''), 30) AS message_text,
                SUBSTRING_INDEX(m.file_url, '/', -1) AS file_name,
                m.created_at AS sent_at

            FROM conversations c
            JOIN users u 
                ON u.user_id = IF(c.user1_id = ?, c.user2_id, c.user1_id)

            LEFT JOIN jobseeker js ON js.jobseeker_id = u.user_id
            LEFT JOIN individual_employer ie ON ie.individual_employer_id = u.user_id
            LEFT JOIN business_employer be ON be.business_employer_id = u.user_id
            LEFT JOIN manpower_provider mp ON mp.manpower_provider_id = u.user_id

            LEFT JOIN messages m 
                ON m.message_id = (
                    SELECT msg.message_id
                    FROM messages msg
                    WHERE msg.conversation_id = c.conversation_id
                    ORDER BY msg.created_at DESC, msg.message_id DESC
                    LIMIT 1
                )

            WHERE c.user1_id = ? OR c.user2_id = ?
            ORDER BY m.created_at DESC
            `,
            [user_id, user_id, user_id]
        );

        const formatted = rows.map((row) => {
            const preview =
                row.message_type === 'file'
                    ? `${row.file_name || ''}`
                    : row.message_text || 'No message';

            const base = {
                conversation_id: row.conversation_id,
                sender_id: row.sender_id,
                role: row.role,
                message_text: preview,
                sent_at: row.sent_at
                    ? format(new Date(row.sent_at), "'at' h:mm a")
                    : null,
            };

            if (row.role === 'jobseeker') {
                return {
                    ...base,
                    full_name: row.js_full_name,
                };
            }

            if (row.role === 'individual-employer') {
                return {
                    ...base,
                    full_name: row.ie_full_name,
                };
            }

            if (row.role === 'business-employer') {
                return {
                    ...base,
                    business_name: row.business_name,
                    authorized_person: row.authorized_person,
                };
            }

            if (row.role === 'manpower-provider') {
                return {
                    ...base,
                    agency_name: row.agency_name,
                    agency_authorized_person: row.agency_authorized_person,
                };
            }

            return {
                ...base,
                name: 'Unknown',
            };
        });

        return formatted;
    } catch (error) {
        console.error('Error fetching user conversations:', error);
        throw error;
    }
};

module.exports = {
    getUserConversations
};
