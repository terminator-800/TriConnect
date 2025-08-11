const { getUncontactedAgencies } = require("../../helpers/get-uncontacted-agency-helper");
const { ROLE } = require("../../utils/roles");
const pool = require("../../config/databaseConnection");

const uncontactedAgencies = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const user_id = req.user?.user_id;
    const role = req.user?.role;

    if (!user_id || !role) {
      return res.status(401).json({ message: "Unauthorized. Invalid token or user not found." });
    }

    if (
      role !== ROLE.BUSINESS_EMPLOYER &&
      role !== ROLE.INDIVIDUAL_EMPLOYER &&
      role !== ROLE.JOBSEEKER
    ) {
      return res.status(403).json({ message: "Forbidden. Only valid roles can access this resource." });
    }

    const agencies = await getUncontactedAgencies(connection, user_id);

    res.json(agencies);
  } catch (error) {
    console.error("Error fetching uncontacted agencies:", error);
    res.status(500).json({ message: "Server error." });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  uncontactedAgencies
};
