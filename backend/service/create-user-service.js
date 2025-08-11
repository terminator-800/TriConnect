const { ROLE } = require("../utils/roles")
const { insertUser,
    insertJobseeker,
    insertBusinessEmployer,
    insertIndividualEmployer,
    insertManpowerProvider } = require("../helpers/create-user-helper");

async function createUsers(connection, email, hashedPassword, role) {

    try {

        const userId = await insertUser(connection, email, hashedPassword, role);

        switch(role){
            case ROLE.JOBSEEKER:
                await insertJobseeker(connection, userId);
                break;

            case ROLE.BUSINESS_EMPLOYER:
                await insertBusinessEmployer(connection, userId);
                break;

            case ROLE.INDIVIDUAL_EMPLOYER:
                await insertIndividualEmployer(connection, userId);
                break;

            case ROLE.MANPOWER_PROVIDER:
                await insertManpowerProvider(connection, userId);
                break;

            default:
                throw new Error("Unsupported role type.")            
        }

        return {success: true, user_id: userId};

    } catch (error) {
        return { success: false, error };
    }
}

module.exports = {
    createUsers
}