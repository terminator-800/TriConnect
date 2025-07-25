const { getUserInfo } = require("../service/usersQuery");
const { ROLE } = require("../utils/roles");

const allowedRoles = [
  ROLE.JOBSEEKER,
  ROLE.BUSINESS_EMPLOYER,
  ROLE.INDIVIDUAL_EMPLOYER,
  ROLE.MANPOWER_PROVIDER,
  ROLE.ADMINISTRATOR
];

const getUserProfile = async (req, res) => {
  try {
    const { user_id, role, email, is_registered } = req.user; 
    
    if (!user_id || !role || !email) {
      return res.status(403).json({ error: 'Forbidden: Invalid token data' });
    }

    if (!is_registered) {
      return res.status(403).json({ error: 'User is not registered' });
    }

    if (!allowedRoles.includes(role)) {
      console.warn(`Unauthorized role attempt: ${role}, user_id: ${user_id}`);
      return res.status(403).json({ error: `Forbidden: Not a valid user type` });
    }

    const userProfile = await getUserInfo(user_id);

    if (!userProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json(userProfile);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = {
  getUserProfile
};
