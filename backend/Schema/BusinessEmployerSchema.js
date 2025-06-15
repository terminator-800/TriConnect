async function createBusinessEmployerTable(connection) {
    const query = `
        CREATE TABLE IF NOT EXISTS business_employer (
            business_employer_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            role ENUM('business_employer') NOT NULL DEFAULT 'business_employer',            
            is_verified BOOLEAN DEFAULT FALSE,
            is_submitted BOOLEAN DEFAULT FALSE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            business_name VARCHAR(100),
            business_address VARCHAR(255),
            industry VARCHAR(100),
            business_size VARCHAR(50),
            authorized_person VARCHAR(100),
            authorized_person_id VARCHAR(255),
            business_permit_BIR VARCHAR(255),
            DTI VARCHAR(255),
            business_establishment VARCHAR(255),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
    `;
    await connection.execute(query);
}

module.exports = { createBusinessEmployerTable };
