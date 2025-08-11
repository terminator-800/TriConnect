const insertUser = async (connection, email, hashedPassword, role) => {
    const [result] = await connection.execute(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [email, hashedPassword, role]
    );
    return result.insertId;
};

const insertJobseeker = async (connection, userId) => {
    await connection.execute(
        "INSERT INTO jobseeker (jobseeker_id) VALUES (?)",
        [userId]
    );
};

const insertBusinessEmployer = async (connection, userId) => {
    await connection.execute(
        "INSERT INTO business_employer (business_employer_id) VALUES (?)",
        [userId]
    );
};

const insertIndividualEmployer = async (connection, userId) => {
    await connection.execute(
        "INSERT INTO individual_employer (individual_employer_id) VALUES (?)",
        [userId]
    );
};

const insertManpowerProvider = async (connection, userId) => {
    await connection.execute(
        "INSERT INTO manpower_provider (manpower_provider_id) VALUES (?)",
        [userId]
    );
};

module.exports = {
    insertUser,
    insertJobseeker,
    insertBusinessEmployer,
    insertIndividualEmployer,
    insertManpowerProvider,
};
