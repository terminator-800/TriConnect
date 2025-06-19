async function createUsersTable(connection) {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            role ENUM('jobseeker', 'business_employer', 'individual_employer', 'manpower_provider', 'admin') NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            is_submitted BOOLEAN DEFAULT FALSE,
            is_rejected BOOLEAN DEFAULT FALSE,
            verified_at DATETIME NULL DEFAULT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,

            -- Jobseeker & Individual Employer fields
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
            nbi_barangay_clearance VARCHAR(255),

            -- Business Employer fields
            business_name VARCHAR(100),
            business_address VARCHAR(255),
            industry VARCHAR(100),
            business_size VARCHAR(50),
            authorized_person VARCHAR(100),
            authorized_person_id VARCHAR(255),
            business_permit_BIR VARCHAR(255),
            DTI VARCHAR(255),
            business_establishment VARCHAR(255),

            -- Manpower Provider fields
            agency_name VARCHAR(100),
            agency_address VARCHAR(255),
            agency_services TEXT,
            agency_authorized_person VARCHAR(100),
            dole_registration_number VARCHAR(255),
            mayors_permit VARCHAR(255),
            agency_certificate VARCHAR(255),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await connection.execute(query);
}

module.exports = { createUsersTable };
