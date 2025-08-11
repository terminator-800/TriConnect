const pool = require("../../config/DatabaseConnection");
const { format } = require("date-fns")
const { ROLE } = require("../../utils/roles")

const verifiedJobPosts = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const [rows] = await connection.query(
            `SELECT 
                jp.job_post_id,
                jp.user_id,
                jp.role,
                jp.job_title,
                jp.job_type,
                jp.salary_range,
                jp.location,
                jp.required_skill,
                jp.job_description,
                jp.approved_at,
                u.email,
                u.verified_at,

                js.full_name AS full_name,
                js.date_of_birth,
                js.phone,
                js.gender,
                js.present_address,
                js.permanent_address,
                js.education,
                js.skills,
                js.government_id,
                js.selfie_with_id,
                js.nbi_barangay_clearance,

                ie.full_name AS individual_full_name,
                ie.date_of_birth AS individual_dob,
                ie.phone AS individual_phone,
                ie.gender AS individual_gender,
                ie.present_address AS individual_present_address,
                ie.permanent_address AS individual_permanent_address,
                ie.government_id AS individual_government_id,
                ie.selfie_with_id AS individual_selfie_with_id,
                ie.nbi_barangay_clearance AS individual_clearance,

                be.business_name,
                be.business_address,
                be.industry,
                be.business_size,
                be.authorized_person,
                be.authorized_person_id,
                be.business_permit_BIR,
                be.DTI,
                be.business_establishment,

                mp.agency_name,
                mp.agency_address,
                mp.agency_services,
                mp.agency_authorized_person,
                mp.authorized_person_id AS mp_authorized_person_id,
                mp.dole_registration_number,
                mp.mayors_permit,
                mp.agency_certificate

                FROM job_post jp
                LEFT JOIN users u ON jp.user_id = u.user_id
                LEFT JOIN jobseeker js ON jp.user_id = js.jobseeker_id
                LEFT JOIN individual_employer ie ON jp.user_id = ie.individual_employer_id
                LEFT JOIN business_employer be ON jp.user_id = be.business_employer_id
                LEFT JOIN manpower_provider mp ON jp.user_id = mp.manpower_provider_id
                WHERE jp.is_verified_jobpost = 1 AND jobpost_status != 'deleted'`
        );

        const formatted = rows.map(user => {
            const base = {
                user_id: user.user_id,
                role: user.role,
                email: user.email,
                job_post_id: user.job_post_id,
                job_title: user.job_title,
                job_type: user.job_type,
                salary_range: user.salary_range,
                location: user.location,
                required_skill: user.required_skill,
                job_description: user.job_description,
                approved_at: user.approved_at ? format(new Date(user.verified_at), 'MMMM dd, yyy \'at\' hh:mm a') : null,
                verified_at: user.verified_at ? format(new Date(user.verified_at), 'MMMM dd, yyy \'at\' hh:mm a') : null,
            };

            switch (user.role) {
                case ROLE.JOBSEEKER:
                    return {
                        ...base,
                        full_name: user.full_name,
                        date_of_birth: user.date_of_birth,
                        phone: user.phone,
                        gender: user.gender,
                        present_address: user.present_address,
                        permanent_address: user.permanent_address,
                        education: user.education,
                        skills: user.skills,
                        government_id: user.government_id,
                        selfie_with_id: user.selfie_with_id,
                        nbi_barangay_clearance: user.nbi_barangay_clearance
                    };

                case ROLE.INDIVIDUAL_EMPLOYER:
                    return {
                        ...base,
                        full_name: user.individual_full_name,
                        date_of_birth: user.individual_dob,
                        phone: user.individual_phone,
                        gender: user.individual_gender,
                        present_address: user.individual_present_address,
                        permanent_address: user.individual_present_address,
                        government_id: user.individual_government_id,
                        selfie_with_id: user.individual_selfie_with_id,
                        nbi_barangay_clearance: user.individual_clearance
                    };

                case ROLE.BUSINESS_EMPLOYER:
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
                        business_establishment: user.business_establishment
                    };

                case ROLE.MANPOWER_PROVIDER:
                    return {
                        ...base,
                        agency_name: user.agency_name,
                        agency_address: user.agency_address,
                        agency_services: user.agency_services,
                        agency_authorized_person: user.agency_authorized_person,
                        authorized_person_id: user.mp_authorized_person_id,
                        dole_registration_number: user.dole_registration_number,
                        mayors_permit: user.mayors_permit,
                        agency_certificate: user.agency_certificate
                    };

                default:
                    return base;
            }
        });

        res.json(formatted);
    } catch (error) {
        console.error('Error getting verified job posts:', error);
        res.status(500).json({ message: 'Failed to get verified job posts.' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    verifiedJobPosts
}