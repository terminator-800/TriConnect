// helpers/userCleanup.js
const fs = require('fs/promises');
const path = require('path');

// Role-specific configuration (kept here for reusability)
const roleConfig = {
  'jobseeker': {
    table: "jobseeker",
    idField: "jobseeker_id",
    resetFields: [
      "full_name", "date_of_birth", "phone", "gender",
      "present_address", "permanent_address", "education", "skills",
      "government_id", "selfie_with_id", "nbi_barangay_clearance"
    ],
    fileFields: ["government_id", "selfie_with_id", "nbi_barangay_clearance"]
  },
  'individual-employer': {
    table: "individual_employer",
    idField: "individual_employer_id",
    resetFields: [
      "full_name", "date_of_birth", "phone", "gender",
      "present_address", "permanent_address",
      "government_id", "selfie_with_id", "nbi_barangay_clearance"
    ],
    fileFields: ["government_id", "selfie_with_id", "nbi_barangay_clearance"]
  },
  'business-employer': {
    table: "business_employer",
    idField: "business_employer_id",
    resetFields: [
      "business_name", "business_address", "industry", "business_size",
      "authorized_person", "authorized_person_id",
      "business_permit_BIR", "DTI", "business_establishment"
    ],
    fileFields: ["authorized_person_id", "business_permit_BIR", "DTI", "business_establishment"]
  },
  'manpower-provider': {
    table: "manpower_provider",
    idField: "manpower_provider_id",
    resetFields: [
      "agency_name", "agency_address", "agency_services",
      "agency_authorized_person", "dole_registration_number",
      "mayors_permit", "agency_certificate", "authorized_person_id"
    ],
    fileFields: ["dole_registration_number", "mayors_permit", "agency_certificate", "authorized_person_id"]
  }
};

function getRoleConfig(role) {
  if (!roleConfig[role]) throw new Error(`Unsupported role: ${role}`);
  return roleConfig[role];
}

async function deleteUserFilesAndFolders(role, userId, name, files) {
  const safeName = (name || 'unknown').replace(/[^a-zA-Z0-9 _.-]/g, '').trim();
  const folderPath = path.join(__dirname, "..", "uploads", role, userId.toString(), safeName);

  // Delete individual files
  for (const file of files) {
    if (file) {
      const fullPath = path.join(folderPath, file);
      try {
        await fs.unlink(fullPath);
      } catch (err) {
        console.warn(`Could not delete file: ${fullPath}`, err.message);
      }
    }
  }

  // Attempt to delete role-specific folder
  try {
    await fs.rmdir(folderPath);
  } catch (err) {
    console.warn(`Could not delete folder: ${folderPath}`, err.message);
  }

  // Clean up user folder if empty
  const userFolderPath = path.join(__dirname, "..", "uploads", role, userId.toString());
  try {
    const remaining = await fs.readdir(userFolderPath);
    if (remaining.length === 0) await fs.rmdir(userFolderPath);
  } catch (err) {
    console.warn(`Could not clean up user folder: ${userFolderPath}`, err.message);
  }
}

module.exports = { getRoleConfig, deleteUserFilesAndFolders };
