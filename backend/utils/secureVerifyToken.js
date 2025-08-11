const jwt = require("jsonwebtoken");
const { getUserInfo } = require("../service/usersQuery");
const { ROLE } = require("../utils/roles");

const allowedRoles = [
    ROLE.BUSINESS_EMPLOYER,
    ROLE.INDIVIDUAL_EMPLOYER,
    ROLE.MANPOWER_PROVIDER,
    ROLE.JOBSEEKER,
    ROLE.ADMINISTRATOR
];

const secureVerifyToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_id, email, role, is_registered } = decoded;

    if (!user_id || !email || !role) {
        throw new Error("Missing critical token fields.");
    }

    if (!is_registered) throw new Error("User is not registered.");

    if (!allowedRoles.includes(role)) {
        throw new Error("Role not authorized to perform this action.");
    }

    const user = await getUserInfo(user_id);

    if (
        !user ||
        user.email !== email ||
        user.role !== role ||
        user.is_registered !== is_registered
    ) {
        throw new Error("Token data does not match database record.");
    }

    return { user_id, role };
};

module.exports = {
    secureVerifyToken
}
