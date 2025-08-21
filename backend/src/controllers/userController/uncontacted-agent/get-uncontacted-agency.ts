import type { PoolConnection, RowDataPacket } from "mysql2/promise";

// Define the return type for each agency
export interface UncontactedAgency extends RowDataPacket {
  user_id: number;
  email: string;
  is_verified: boolean | 0 | 1;
  agency_name: string;
  agency_address: string;
  agency_services: string;
}

export const getUncontactedAgencies = async (
  connection: PoolConnection,
  userId: number
): Promise<UncontactedAgency[]> => {
  const [rows] = await connection.execute<UncontactedAgency[]>(
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
};
