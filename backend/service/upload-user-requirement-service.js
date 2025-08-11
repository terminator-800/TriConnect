async function uploadUserRequirement(connection, payload) {

    try {
        switch (payload.role) {
            case 'jobseeker':
                await connection.execute(
                    `UPDATE jobseeker SET 
                        full_name = ?, 
                        date_of_birth = ?, 
                        phone = ?, 
                        gender = ?, 
                        present_address = ?, 
                        permanent_address = ?, 
                        education = ?, 
                        skills = ?, 
                        government_id = ?, 
                        selfie_with_id = ?, 
                        nbi_barangay_clearance = ?
                    WHERE jobseeker_id = ?`,
                    [
                        payload.full_name,
                        payload.date_of_birth,
                        payload.phone,
                        payload.gender,
                        payload.present_address,
                        payload.permanent_address,
                        payload.education,
                        payload.skills,
                        payload.government_id,
                        payload.selfie_with_id,
                        payload.nbi_barangay_clearance,
                        payload.user_id,
                    ]
                );
                break;

            case 'individual-employer':
                await connection.execute(
                    `UPDATE individual_employer SET 
                        full_name = ?, 
                        date_of_birth = ?, 
                        phone = ?, 
                        gender = ?, 
                        present_address = ?, 
                        permanent_address = ?, 
                        government_id = ?, 
                        selfie_with_id = ?, 
                        nbi_barangay_clearance = ?
                    WHERE individual_employer_id = ?`,
                    [
                        payload.full_name,
                        payload.date_of_birth,
                        payload.phone,
                        payload.gender,
                        payload.present_address,
                        payload.permanent_address,
                        payload.government_id,
                        payload.selfie_with_id,
                        payload.nbi_barangay_clearance,
                        payload.user_id,
                    ]
                );
                break;

            case 'business-employer':
                await connection.execute(
                    `UPDATE business_employer SET 
                        business_name = ?, 
                        business_address = ?, 
                        industry = ?, 
                        business_size = ?, 
                        authorized_person = ?, 
                        authorized_person_id = ?, 
                        business_permit_BIR = ?, 
                        DTI = ?, 
                        business_establishment = ?
                    WHERE business_employer_id = ?`,
                    [
                        payload.business_name,
                        payload.business_address,
                        payload.industry,
                        payload.business_size,
                        payload.authorized_person,
                        payload.authorized_person_id,
                        payload.business_permit_BIR,
                        payload.DTI,
                        payload.business_establishment,
                        payload.user_id,
                    ]
                );
                break;

            case 'manpower-provider':
                await connection.execute(
                    `UPDATE manpower_provider SET 
                        agency_name = ?, 
                        agency_address = ?, 
                        agency_services = ?, 
                        agency_authorized_person = ?, 
                        dole_registration_number = ?, 
                        mayors_permit = ?, 
                        agency_certificate = ?, 
                        authorized_person_id = ?
                    WHERE manpower_provider_id = ?`,
                    [
                        payload.agency_name,
                        payload.agency_address,
                        payload.agency_services,
                        payload.agency_authorized_person,
                        payload.dole_registration_number,
                        payload.mayors_permit,
                        payload.agency_certificate,
                        payload.authorized_person_id,
                        payload.user_id,
                    ]
                );
                break;

            default:
                throw new Error("Unknown role during requirement upload");
        }

        await connection.execute(
            `UPDATE users 
             SET 
                is_submitted = TRUE, 
                is_verified = FALSE, 
                is_rejected = CASE 
                    WHEN is_rejected = TRUE THEN FALSE 
                    ELSE is_rejected 
                END 
             WHERE user_id = ?`,
            [payload.user_id]
        );

    } catch (error) {
        throw error;
    } 
}

module.exports = {
    uploadUserRequirement
}