import { fileURLToPath } from 'url';
import fs from "fs/promises";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import logger from "../../../config/logger.js";

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
  if (!roleConfig[role]) {
    logger.error(`Unsupported role requested: ${role}`);
    throw new Error(`Unsupported role: ${role}`);
  }
  return roleConfig[role];
}

export function extractPublicIdFromUrl(url: string | null): string | null {
  if (!url) {
    logger.warn(`extractPublicIdFromUrl called with null or empty URL`);
    return null;
  }

  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
    const match = url.match(regex);

    if (!match || !match[1]) {
      logger.warn(`Failed to extract publicId from URL: ${url}`);
      return null;
      
    }
    return match[1];
  } catch (err: any) {
    logger.error(`Error extracting publicId from URL: ${url}`, { err });
    return null;
  }
}




