const dbPromise = require("../config/DatabaseConnection");
const { ROLE } = require("../utils/roles");

const uncontactedAgencies = async (req, res) => {
  try {
    const db = await dbPromise;

    const userId = req.user?.user_id;  
    const userRole = req.user?.role;   

    if (!userId || !userRole) {
      return res.status(401).json({ message: "Unauthorized. Invalid token or user not found." });
    }

    if (userRole !== ROLE.BUSINESS_EMPLOYER && userRole !== ROLE.INDIVIDUAL_EMPLOYER && userRole !== ROLE.JOBSEEKER) {
      return res.status(403).json({ message: "Forbidden. Only valid roles can access this resource." });
    }

    const [agencies] = await db.execute(`
      SELECT * FROM users
      WHERE role = 'manpower-provider'
      AND user_id NOT IN (
        SELECT 
          CASE 
            WHEN user1_id = ? THEN user2_id 
            ELSE user1_id 
          END AS other_user_id
        FROM conversations
        WHERE user1_id = ? OR user2_id = ?
      )
    `, [userId, userId, userId]);

    res.json(agencies);
  } catch (error) {
    console.error("Error fetching uncontacted agencies:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  uncontactedAgencies
};
