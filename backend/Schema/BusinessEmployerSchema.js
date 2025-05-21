async function createEmployerTable(connection) {
    const query = `
        CREATE TABLE IF NOT EXISTS business_employer (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100), 
            date_of_birth DATE,
            phone VARCHAR(20),
            gender ENUM('Male', 'Female', 'Other'),
            present_address VARCHAR(255),
            permanent_address VARCHAR(255),
            education TEXT,
            skills TEXT,            
            government_id VARCHAR(255),
            selfie_with_id VARCHAR(255),
            nbi_barangray_clearance VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await connection.execute(query);
}

module.exports = { createEmployerTable };