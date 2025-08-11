async function getUncontactedAgencies(connection, userId) {
    const [rows] = await connection.execute(
        `
    SELECT u.user_id, u.email, u.is_verified, 
           mp.agency_name, mp.agency_address, mp.agency_services
    FROM users u
    JOIN manpower_provider mp ON u.user_id = mp.manpower_provider_id
    LEFT JOIN conversations c 
      ON (
        (c.user1_id = ? AND c.user2_id = u.user_id)
        OR (c.user2_id = ? AND c.user1_id = u.user_id)
      )
    WHERE u.role = 'manpower-provider' AND c.conversation_id IS NULL
    `,
        [userId, userId]
    );

    return rows;
}

module.exports = {
    getUncontactedAgencies
};
