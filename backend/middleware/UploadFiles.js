const multer = require('multer');
const path = require('path');
const fs = require('fs');

// === Directory Setup ===
const uploadDir = './uploads';
const businessEmployerDir = './uploads/business_employer';
const jobseekerDir = './uploads/jobseeker';
const manpowerProviderDir = './uploads/manpower_provider';
const individualEmployerDir = './uploads/individual_employer';

// Create directories if they don't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(businessEmployerDir)) {
    fs.mkdirSync(businessEmployerDir);
}
if (!fs.existsSync(individualEmployerDir)) {
    fs.mkdirSync(individualEmployerDir);
}
if (!fs.existsSync(jobseekerDir)) {
    fs.mkdirSync(jobseekerDir);
}
if (!fs.existsSync(manpowerProviderDir)) {
    fs.mkdirSync(manpowerProviderDir);
}


// === File Type Filtering (PDF and Images only) ===
const fileFilter = function (req, file, cb) {
    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only PDF and image files are allowed'), false); // Reject the file
    }
};

// === Jobseeker Storage Configuration ===
const jobseekerStorage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/jobseeker');
    },
    filename: function (_req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// === Business Employer Storage Configuration ===
const businessEmployerStorage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/business_employer');
    },
    filename: function (_req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// === Individual Employer Storage Configuration ===
const individualEmployerStorage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/individual_employer');
    },
    filename: function (_req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// === Manpower Provider Storage Configuration ===
const manpowerProviderStorage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/manpower_provider');
    },
    filename: function (_req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// === Multer Upload Instances ===
const jobseekerUpload = multer({ storage: jobseekerStorage, fileFilter });
const businessEmployerUpload = multer({ storage: businessEmployerStorage, fileFilter });
const manpowerProviderUpload = multer({ storage: manpowerProviderStorage, fileFilter });
const individualEmployerUpload = multer({ storage: individualEmployerStorage, fileFilter });

// === Upload Middleware (Multiple Files per Role) ===

// Jobseeker Files
const uploadJobseekerFiles = jobseekerUpload.fields([
    { name: 'government_id', maxCount: 1 },
    { name: 'selfie_with_id', maxCount: 1 },
    { name: 'nbi_barangay_clearance', maxCount: 1 },
]);

// Business Employer Files
const uploadBusinessEmployerFiles = businessEmployerUpload.fields([
    { name: 'authorized_person_id', maxCount: 1 },
    { name: 'business_permit_BIR', maxCount: 1 },
    { name: 'DTI', maxCount: 1 },
    { name: 'business_establishment', maxCount: 1 },
]);

// Individual Employer Files
const uploadIndividualEmployerFiles = individualEmployerUpload.fields([
    { name: 'government_id', maxCount: 1 },
    { name: 'selfie_with_id', maxCount: 1 },
    { name: 'nbi_barangay_clearance', maxCount: 1 },
]);

// Manpower Provider Files
const uploadManpowerProviderFiles = manpowerProviderUpload.fields([
    { name: 'dole_registration_number', maxCount: 1 },
    { name: 'mayors_permit', maxCount: 1 },
    { name: 'agency_certificate', maxCount: 1 },
    { name: 'authorized_person_id', maxCount: 1 },
]);



// === Export Middleware for Use in Routes ===
module.exports = {
    uploadBusinessEmployerFiles,
    uploadJobseekerFiles,
    uploadManpowerProviderFiles,
    uploadIndividualEmployerFiles
};
