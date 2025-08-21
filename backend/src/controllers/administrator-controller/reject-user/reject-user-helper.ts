import { fileURLToPath } from 'url';
import fs from "fs/promises";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type Role = "jobseeker" | "individual-employer" | "business-employer" | "manpower-provider";

interface RoleConfig {
  table: string;
  idField: string;
  resetFields: string[];
  fileFields: string[];
}

const roleConfig: Record<Role, RoleConfig> = {
  "jobseeker": {
    table: "jobseeker",
    idField: "jobseeker_id",
    resetFields: [
      "full_name", "date_of_birth", "phone", "gender",
      "present_address", "permanent_address", "education", "skills",
      "government_id", "selfie_with_id", "nbi_barangay_clearance"
    ],
    fileFields: ["government_id", "selfie_with_id", "nbi_barangay_clearance"]
  },
  "individual-employer": {
    table: "individual_employer",
    idField: "individual_employer_id",
    resetFields: [
      "full_name", "date_of_birth", "phone", "gender",
      "present_address", "permanent_address",
      "government_id", "selfie_with_id", "nbi_barangay_clearance"
    ],
    fileFields: ["government_id", "selfie_with_id", "nbi_barangay_clearance"]
  },
  "business-employer": {
    table: "business_employer",
    idField: "business_employer_id",
    resetFields: [
      "business_name", "business_address", "industry", "business_size",
      "authorized_person", "authorized_person_id",
      "business_permit_BIR", "DTI", "business_establishment"
    ],
    fileFields: ["authorized_person_id", "business_permit_BIR", "DTI", "business_establishment"]
  },
  "manpower-provider": {
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

export function getRoleConfig(role: Role): RoleConfig {
  if (!roleConfig[role]) throw new Error(`Unsupported role: ${role}`);
  return roleConfig[role];
}

/**
 * Deletes physical files and user folders
 * @param role Role of the user
 * @param userId user_id from DB
 * @param name display name (optional)
 * @param files Array of full relative file paths (from DB)
 */
export async function deleteUserFilesAndFolders(
  role: Role,
  userId: number,
  name: string | undefined,
  files: (string | undefined)[]
): Promise<void> {

  console.log("Deleting physical folder: ", role, userId, name, files);

  // Delete each file using its full relative path
  for (const file of files) {
    if (!file) continue;

    const fullPath = path.join(__dirname, "..", file); // file already includes uploads/... path
    try {
      await fs.unlink(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    } catch (err: any) {
      if (err.code !== "ENOENT") console.warn(`Could not delete file: ${fullPath}`, err.message);
    }
  }

  // Delete the displayName subfolder if provided
  if (name) {
    const safeName = name.replace(/[^a-zA-Z0-9 _.-]/g, "").trim();
    const folderPath = path.join(__dirname, "..", "uploads", role, userId.toString(), safeName);

    try {
      await fs.rm(folderPath, { recursive: true, force: true });
      console.log(`Deleted displayName folder: ${folderPath}`);
    } catch (err: any) {
      if (err.code !== "ENOENT") console.warn(`Could not delete folder: ${folderPath}`, err.message);
    }
  }

  // Remove the parent user folder only if empty
  const userFolderPath = path.join(__dirname, "..", "uploads", role, userId.toString());
  try {
    const remaining = await fs.readdir(userFolderPath);
    if (remaining.length === 0) {
      await fs.rm(userFolderPath, { recursive: true, force: true });
      console.log(`Deleted user folder: ${userFolderPath}`);
    }
  } catch (err: any) {
    if (err.code !== "ENOENT") console.warn(`Could not clean up user folder: ${userFolderPath}`, err.message);
  }
}
