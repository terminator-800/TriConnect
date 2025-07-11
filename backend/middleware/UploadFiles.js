const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// === Directory Setup ===
const baseUploadDir = './uploads';
const chatUploadDir = './uploads/chat';
const roles = ['jobseeker', 'business_employer', 'individual_employer', 'manpower_provider'];

if (!fs.existsSync(chatUploadDir)) {
    fs.mkdirSync(chatUploadDir, { recursive: true });
}

// === Multer Storage Config / FILE UPLOAD FOR CHAT MESSAGES ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const tempDir = path.join(chatUploadDir, 'temp');
            fs.mkdirSync(tempDir, { recursive: true });
            cb(null, tempDir);
        } catch (error) {
            cb(new Error('Failed to create temp upload directory'), false);
        }
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});


// ✅ Restrict to only images and single file upload
const imageOnlyFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/png', 'image/jpeg', 'image/jpg',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error(`Only image or document files (PDF, DOC, DOCX) are allowed.`), false);
    }
    cb(null, true);
};

const chatImageUpload = multer({ storage, fileFilter: imageOnlyFilter }).single('file');




























// === Ensure Base Role Directories Exist ===
roles.forEach(role => {
    const dir = path.join(baseUploadDir, role);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// === Sanitize folder name ===
const sanitizeFolderName = (name) => {
    return name.replace(/[^a-zA-Z0-9 _.-]/g, '').trim();
};

// === File Filter (PDF and Images) ===
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    allowedMimeTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Only PDF and image files are allowed'), false);
};

// === Destination Generator ===
const makeStorage = (role, nameField, fallbackName) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            try {
                const token = req.cookies.token;
                if (!token) {
                    return cb(new Error('Unauthorized: No token provided'), false);
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded.user_id;

                if (!userId) {
                    return cb(new Error('Invalid token: user_id not found'), false);
                }

                const rawName = req.body[nameField] || fallbackName;
                const safeName = sanitizeFolderName(rawName);
                const folderPath = path.join(baseUploadDir, role, userId.toString(), safeName);
                fs.mkdirSync(folderPath, { recursive: true });
                cb(null, folderPath);
            } catch (error) {
                return cb(new Error('Invalid or expired token'), false);
            }
        },
        filename: (_req, file, cb) => {
            const uniqueName = Date.now() + path.extname(file.originalname);
            cb(null, uniqueName);
        }
    });
};

// === Storage Definitions per Role ===
const jobseekerUpload = multer({
    storage: makeStorage('jobseeker', 'full_name', 'unknown_jobseeker'),
    fileFilter
});

const businessEmployerUpload = multer({
    storage: makeStorage('business_employer', 'business_name', 'unknown_business'),
    fileFilter
});

const individualEmployerUpload = multer({
    storage: makeStorage('individual_employer', 'full_name', 'unknown_individual'),
    fileFilter
});

const manpowerProviderUpload = multer({
    storage: makeStorage('manpower_provider', 'agency_name', 'unknown_agency'),
    fileFilter
});

// === Upload Middleware for Each Role ===
const uploadJobseekerFiles = jobseekerUpload.fields([
    { name: 'government_id', maxCount: 1 },
    { name: 'selfie_with_id', maxCount: 1 },
    { name: 'nbi_barangay_clearance', maxCount: 1 },
]);

const uploadBusinessEmployerFiles = businessEmployerUpload.fields([
    { name: 'authorized_person_id', maxCount: 1 },
    { name: 'business_permit_BIR', maxCount: 1 },
    { name: 'DTI', maxCount: 1 },
    { name: 'business_establishment', maxCount: 1 },
]);

const uploadIndividualEmployerFiles = individualEmployerUpload.fields([
    { name: 'government_id', maxCount: 1 },
    { name: 'selfie_with_id', maxCount: 1 },
    { name: 'nbi_barangay_clearance', maxCount: 1 },
]);

const uploadManpowerProviderFiles = manpowerProviderUpload.fields([
    { name: 'dole_registration_number', maxCount: 1 },
    { name: 'mayors_permit', maxCount: 1 },
    { name: 'agency_certificate', maxCount: 1 },
    { name: 'authorized_person_id', maxCount: 1 },
]);

// === Export for Use in Routes ===
module.exports = {
    uploadJobseekerFiles,
    uploadBusinessEmployerFiles,
    uploadIndividualEmployerFiles,
    uploadManpowerProviderFiles,
    chatImageUpload,
};