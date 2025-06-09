async function createManpowerProviderTable(connection) {
    const query = `
        CREATE TABLE IF NOT EXISTS manpower_provider (
            manpower_provider_id INT AUTO_INCREMENT PRIMARY KEY,
            role ENUM('manpower_provider') NOT NULL DEFAULT 'manpower_provider',
            is_verified BOOLEAN DEFAULT FALSE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            agency_name VARCHAR(100),
            agency_address VARCHAR(255),
            agency_services TEXT, 
            agency_authorize_person VARCHAR(100),

            -- These fields store image file paths or URLs
            dole_registration_number VARCHAR(255),
            mayors_permit VARCHAR(255),
            agency_certificate VARCHAR(255),
            authorized_person_id VARCHAR(255),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await connection.execute(query);
}

module.exports = { createManpowerProviderTable };
