async function createUsersTable(connection) {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            role VARCHAR(50) DEFAULT NULL,
            is_verified BOOLEAN DEFAULT FALSE,            
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await connection.execute(query);
}

module.exports = { createUsersTable };