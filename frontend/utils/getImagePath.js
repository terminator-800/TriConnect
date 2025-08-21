import { ROLE } from "./role";

export const getImagePath = (user, dbPath) => {
    if (!dbPath || !user) return null;

    // Remove any leading "uploads/" from DB path, because express serves from /uploads
    const relativePath = dbPath.replace(/^uploads[\\/]/, '');

    // Encode each segment of the path
    const encodedPath = relativePath
        .split('/')
        .map(encodeURIComponent)
        .join('/');

    return `${import.meta.env.VITE_API_URL}/uploads/${encodedPath}`;
};

// Map of documents per role
export const documentMap = {
    [ROLE.JOBSEEKER]: [
        { key: 'government_id', label: 'Government ID' },
        { key: 'selfie_with_id', label: 'Selfie with ID' },
        { key: 'nbi_barangay_clearance', label: 'NBI / Barangay Cert.' },
    ],
    [ROLE.BUSINESS_EMPLOYER]: [
        { key: 'authorized_person_id', label: 'Authorized Person ID' },
        { key: 'business_permit_BIR', label: 'BIR Permit' },
        { key: 'DTI', label: 'DTI' },
        { key: 'business_establishment', label: 'Establishment' },
    ],
    [ROLE.INDIVIDUAL_EMPLOYER]: [
        { key: 'government_id', label: 'Government ID' },
        { key: 'selfie_with_id', label: 'Selfie with ID' },
        { key: 'nbi_barangay_clearance', label: 'NBI / Barangay Cert.' },
    ],
    [ROLE.MANPOWER_PROVIDER]: [
        { key: 'dole_registration_number', label: 'DOLE Registration No.' },
        { key: 'mayors_permit', label: "Mayor's Permit" },
        { key: 'agency_certificate', label: 'Agency Certificate' },
        { key: 'authorized_person_id', label: 'Authorized Person ID' },
    ],
};

// Map of info fields per role
export const infoMap = {
    [ROLE.JOBSEEKER]: [
        { key: 'full_name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'gender', label: 'Gender' },
        { key: 'present_address', label: 'Present Address' },
        { key: 'permanent_address', label: 'Permanent Address' },
    ],
    [ROLE.BUSINESS_EMPLOYER]: [
        { key: 'business_name', label: 'Business Name' },
        { key: 'email', label: 'Email' },
        { key: 'industry', label: 'Industry' },
        { key: 'business_size', label: 'Business Size' },
        { key: 'authorized_person', label: 'Authorized Person' },
        { key: 'business_address', label: 'Business Address' },
    ],
    [ROLE.INDIVIDUAL_EMPLOYER]: [
        { key: 'full_name', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'gender', label: 'Gender' },
        { key: 'present_address', label: 'Present Address' },
        { key: 'permanent_address', label: 'Permanent Address' },
    ],
    [ROLE.MANPOWER_PROVIDER]: [
        { key: 'agency_name', label: 'Agency Name' },
        { key: 'email', label: 'Email' },
        { key: 'agency_address', label: 'Address' },
        { key: 'agency_services', label: 'Services Offered' },
        { key: 'agency_authorized_person', label: 'Authorized Person' },
    ],
};
