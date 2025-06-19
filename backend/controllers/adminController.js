const { fetchAllUser, verifyUsers, getUserInfo, rejectUsers } = require("../service/UsersQuery");
const { verifyJobseeker, rejectJobseeker } = require("../service/JobseekerQuery")
const { verifyBusinessEmployer, rejectBusinessEmployer } = require("../service/BusinessEmployerQuery")
const { verifyIndividualEmployer, rejectIndividualEmployer } = require("../service/IndividualEmployerQuery")
const { verifyManpowerProvider, rejectManpowerProvider } = require("../service/ManpowerProviderQuery")
const dbPromise = require("../config/DatabaseConnection");

const fetchUser = async (req, res) => {
    try {
        const users = await fetchAllUser();
        res.status(200).json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

const verifyUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await getUserInfo(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userRole = user.role;

        switch (userRole) {
            case 'jobseeker':
                await verifyJobseeker(user_id);
                break;
            case 'business_employer':
                await verifyBusinessEmployer(user_id);
                break;
            case 'individual_employer':
                await verifyIndividualEmployer(user_id);
                break;
            case 'manpower_provider':
                await verifyManpowerProvider(user_id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid user role.' });
        }

        await verifyUsers(user_id); 

        res.json({ success: true, message: `User verified successfully (${userRole}).` });

    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


const rejectUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await getUserInfo(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userRole = user.role;

        switch (userRole) {
            case 'jobseeker':
                await rejectJobseeker(user_id);
                break;
            case 'business_employer':
                await rejectBusinessEmployer(user_id);
                break;
            case 'individual_employer':
                await rejectIndividualEmployer(user_id);
                break;
            case 'manpower_provider':
                await rejectManpowerProvider(user_id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid user role.' });
        }

        await rejectUsers(user_id); 

        res.json({ success: true, message: `User rejected successfully (${user_id}).` });

    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = { fetchUser, verifyUser, verifyManpowerProvider, rejectUser }
