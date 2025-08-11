const pool = require("../../config/databaseConnection2");
const { format } = require('date-fns'); 

const submittedUsers = async (req, res) => {
    if (req.user.role !== 'administrator') {
        return res.status(403).json({ error: 'Forbidden: Admins only.' });
    }

    let connection;

    try {
        connection = await pool.getConnection();
        const users = await getSubmittedUsers(connection);
        res.json(users);
    } catch (err) {
        console.error('Error in submittedUsers route:', err);
        res.status(500).json({ error: 'Failed to fetch submitted users' });
    } finally {
        if (connection) connection.release();
    }
};

async function getSubmittedUsers(connection) {
    const [rows] = await connection.query(`
        SELECT 
            u.user_id,
            u.email,
            u.role,
            u.created_at,
            u.verified_at,

            -- Jobseeker
            js.full_name AS js_full_name,
            js.date_of_birth AS js_dob,
            js.phone AS js_phone,
            js.gender AS js_gender,
            js.present_address AS js_present_address,
            js.permanent_address AS js_permanent_address,
            js.education AS js_education,
            js.skills AS js_skills,
            js.government_id AS js_government_id,
            js.selfie_with_id AS js_selfie_with_id,
            js.nbi_barangay_clearance AS js_clearance,

            -- Individual Employer
            ie.full_name AS ie_full_name,
            ie.date_of_birth AS ie_dob,
            ie.phone AS ie_phone,
            ie.gender AS ie_gender,
            ie.present_address AS ie_present_address,
            ie.permanent_address AS ie_permanent_address,
            ie.government_id AS ie_government_id,
            ie.selfie_with_id AS ie_selfie_with_id,
            ie.nbi_barangay_clearance AS ie_clearance,

            -- Business Employer
            be.business_name,
            be.business_address,
            be.industry,
            be.business_size,
            be.authorized_person,
            be.authorized_person_id,
            be.business_permit_BIR,
            be.DTI,
            be.business_establishment,

            -- Manpower Provider
            mp.agency_name,
            mp.agency_address,
            mp.agency_services,
            mp.agency_authorized_person,
            mp.authorized_person_id AS mp_authorized_person_id,
            mp.dole_registration_number,
            mp.mayors_permit,
            mp.agency_certificate

        FROM users u
        LEFT JOIN jobseeker js 
            ON u.user_id = js.jobseeker_id AND u.role = 'jobseeker'
        LEFT JOIN individual_employer ie 
            ON u.user_id = ie.individual_employer_id AND u.role = 'individual-employer'
        LEFT JOIN business_employer be 
            ON u.user_id = be.business_employer_id AND u.role = 'business-employer'
        LEFT JOIN manpower_provider mp 
            ON u.user_id = mp.manpower_provider_id AND u.role = 'manpower-provider'
        WHERE 
            u.is_submitted = TRUE
            AND u.is_verified = FALSE
            AND u.is_rejected = FALSE
            AND u.verified_at IS NULL
            AND u.email != ''
        ORDER BY u.created_at DESC;
    `);

    return rows.map((user) => {
        const base = {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
            created_at: user.created_at ? format(new Date(user.created_at), "MMMM dd, yyyy 'at' hh:mm a") : null,
            verified_at: user.verified_at ? format(new Date(user.verified_at), "MMMM dd, yyyy 'at' hh:mm a") : null,
        };

        if (user.role === 'jobseeker') {
            return {
                ...base,
                full_name: user.js_full_name,
                date_of_birth: user.js_dob ? format(new Date(user.js_dob), 'MMMM dd, yyyy') : null,
                phone: user.js_phone,
                gender: user.js_gender,
                present_address: user.js_present_address,
                permanent_address: user.js_permanent_address,
                education: user.js_education,
                skills: user.js_skills,
                government_id: user.js_government_id,
                selfie_with_id: user.js_selfie_with_id,
                nbi_barangay_clearance: user.js_clearance,
            };
        }

        if (user.role === 'individual-employer') {
            return {
                ...base,
                full_name: user.ie_full_name,
                date_of_birth: user.ie_dob ? format(new Date(user.ie_dob), 'MMMM dd, yyyy') : null,
                phone: user.ie_phone,
                gender: user.ie_gender,
                present_address: user.ie_present_address,
                permanent_address: user.ie_permanent_address,
                government_id: user.ie_government_id,
                selfie_with_id: user.ie_selfie_with_id,
                nbi_barangay_clearance: user.ie_clearance,
            };
        }

        if (user.role === 'business-employer') {
            return {
                ...base,
                business_name: user.business_name,
                business_address: user.business_address,
                industry: user.industry,
                business_size: user.business_size,
                authorized_person: user.authorized_person,
                authorized_person_id: user.authorized_person_id,
                business_permit_BIR: user.business_permit_BIR,
                DTI: user.DTI,
                business_establishment: user.business_establishment,
            };
        }

        if (user.role === 'manpower-provider') {
            return {
                ...base,
                agency_name: user.agency_name,
                agency_address: user.agency_address,
                agency_services: user.agency_services,
                agency_authorized_person: user.agency_authorized_person,
                authorized_person_id: user.mp_authorized_person_id,
                dole_registration_number: user.dole_registration_number,
                mayors_permit: user.mayors_permit,
                agency_certificate: user.agency_certificate,
            };
        }

        return base;
    });
}

module.exports = { submittedUsers };
