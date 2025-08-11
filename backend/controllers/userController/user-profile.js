const { format } = require('date-fns');
const { ROLE } = require('../../utils/roles');
const pool = require('../../config/DatabaseConnection');

const allowedRoles = [
  ROLE.JOBSEEKER,
  ROLE.BUSINESS_EMPLOYER,
  ROLE.INDIVIDUAL_EMPLOYER,
  ROLE.MANPOWER_PROVIDER,
  ROLE.ADMINISTRATOR
];

const getUserProfile = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { user_id, role, email, is_registered } = req.user;

    if (!user_id || !role || !email) {
      return res.status(403).json({ error: 'Forbidden: Invalid user data in token' });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden: Unauthorized role' });
    }

    if (!is_registered) {
      return res.status(403).json({ error: 'User is not registered' });
    }

    let userProfile;

    switch (role) {
      case ROLE.JOBSEEKER:
        userProfile = await fetchJobseekerProfile(connection, user_id);
        break;
      case ROLE.BUSINESS_EMPLOYER:
        userProfile = await fetchBusinessEmployerProfile(connection, user_id);
        break;
      case ROLE.INDIVIDUAL_EMPLOYER:
        userProfile = await fetchIndividualEmployerProfile(connection, user_id);
        break;
      case ROLE.MANPOWER_PROVIDER:
        userProfile = await fetchManpowerProviderProfile(connection, user_id);
        break;
      case ROLE.ADMINISTRATOR:
        userProfile = await fetchAdministratorProfile(connection, user_id);
        break;
      default:
        return res.status(403).json({ error: 'Unsupported role for profile access' });
    }

    if (!userProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error in getUserProfile:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
};

/**
 * Returns selected fields for jobseeker.
 */
async function fetchJobseekerProfile(connection, user_id) {
  try {
    const [rows] = await connection.query(
      `
      SELECT 
        j.jobseeker_id AS user_id,
        j.full_name,
        u.email,
        j.gender,
        j.phone,
        j.date_of_birth,
        u.is_verified,
        u.is_submitted,
        u.is_rejected,
        u.account_status
      FROM jobseeker j
      JOIN users u ON j.jobseeker_id = u.user_id
      WHERE j.jobseeker_id = ?
      `,
      [user_id]
    );

    const profile = rows[0] || null;

    if (profile?.date_of_birth) {
      profile.date_of_birth = format(new Date(profile.date_of_birth), "MMMM dd, yyyy 'at' hh:mm a");
    }

    return profile;
  } catch (error) {
    console.error('Error fetching jobseeker profile:', error);
    throw error;
  }
}


/**
 * Returns selected fields for business employer.
 */
async function fetchBusinessEmployerProfile(connection, user_id) {
  try {
    const [rows] = await connection.query(
      `
      SELECT 
        b.business_employer_id AS user_id,
        b.business_name,
        b.industry,
        b.business_address,
        b.business_size,
        b.authorized_person,
        u.email,
        u.is_verified,
        u.is_submitted,
        u.is_rejected,
        u.account_status
      FROM business_employer b
      JOIN users u ON b.business_employer_id = u.user_id
      WHERE b.business_employer_id = ?
      `,
      [user_id]
    );

    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching business employer profile:', error);
    throw error;
  }
}

async function fetchIndividualEmployerProfile(connection, user_id) {
  try {
    const [rows] = await connection.query(
      `
      SELECT 
        i.individual_employer_id AS user_id,
        i.full_name,
        i.gender,
        i.phone,
        i.date_of_birth,
        i.present_address,
        i.permanent_address,
        u.email,
        u.is_verified,
        u.is_submitted,
        u.is_rejected,
        u.account_status
      FROM individual_employer i
      JOIN users u ON i.individual_employer_id = u.user_id
      WHERE i.individual_employer_id = ?
      `,
      [user_id]
    );

    const profile = rows[0] || null;

    if (profile?.date_of_birth) {
      profile.date_of_birth = format(new Date(profile.date_of_birth), "MMMM dd, yyyy 'at' hh:mm a");
    }

    return profile;
  } catch (error) {
    console.error('Error fetching individual employer profile:', error);
    throw error;
  }
}

async function fetchManpowerProviderProfile(connection, user_id) {
  try {
    const [rows] = await connection.query(
      `
      SELECT 
        m.manpower_provider_id AS user_id,
        m.agency_name,
        m.agency_address,
        m.agency_services,
        m.agency_authorized_person,
        u.email,
        u.is_verified,
        u.is_submitted,
        u.is_rejected,
        u.account_status
      FROM manpower_provider m
      JOIN users u ON m.manpower_provider_id = u.user_id
      WHERE m.manpower_provider_id = ?
      `,
      [user_id]
    );

    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching manpower provider profile:', error);
    throw error;
  }
}

async function fetchAdministratorProfile(connection, user_id) {
  try {
    const [rows] = await connection.query(
      `
      SELECT 
        u.user_id,
        u.email,
        u.role,
        u.is_verified,
        u.is_submitted,
        u.is_rejected,
        u.account_status
      FROM users u
      WHERE u.user_id = ? AND u.role = 'administrator'
      `,
      [user_id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching administrator profile:', error);
    throw error;
  }
}

module.exports = {
  getUserProfile
};
