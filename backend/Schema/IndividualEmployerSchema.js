async function createIndividualEmployerTable(connection) {
    const query2 = `
        CREATE TABLE IF NOT EXISTS individual_employer (
            individual_employer_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            role ENUM('individual_employer') NOT NULL DEFAULT 'individual_employer',            
            is_verified BOOLEAN DEFAULT FALSE,
            is_submitted BOOLEAN DEFAULT FALSE,
            is_rejected BOOLEAN DEFAULT FALSE,
            verified_at DATETIME NULL DEFAULT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100), 
            date_of_birth DATE,
            phone VARCHAR(20),
            gender ENUM('Male', 'Female', 'Other'),
            present_address VARCHAR(255),
            permanent_address VARCHAR(255),        
            government_id VARCHAR(255),
            selfie_with_id VARCHAR(255),
            nbi_barangay_clearance VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE

        );
    `;
    await connection.execute(query2);
}

module.exports = { createIndividualEmployerTable };