async function createIndividualEmployerTable(connection) {
  const query = `
    CREATE TABLE IF NOT EXISTS individual_employer (
      individual_employer_id INT PRIMARY KEY,
      full_name VARCHAR(100),
      date_of_birth DATE,
      phone VARCHAR(20),
      gender ENUM('Male', 'Female', 'Other'),
      present_address VARCHAR(255),
      permanent_address VARCHAR(255),
      government_id VARCHAR(255),
      selfie_with_id VARCHAR(255),
      nbi_barangay_clearance VARCHAR(255),
      FOREIGN KEY (individual_employer_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `;
  await connection.execute(query);
}

module.exports = { 
  createIndividualEmployerTable
};