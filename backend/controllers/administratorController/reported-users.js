const { format } = require("date-fns")
const pool = require("../../config/databaseConnection");

const reportedUsers = async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();

        const [rows] = await connection.query(`
      SELECT 
        r.report_id,
        r.reason,
        r.message,
        r.created_at,
        r.reported_by AS reporter_id,
        r.reported_user_id,
        r.status AS report_status,

        ru.role AS reported_user_role,
        ru.account_status AS reported_user_status,
        rr.role AS reporter_role,

        -- Reporter Names and Extra Info
        js1.full_name AS reporter_js_name,
        ie1.full_name AS reporter_ie_name,
        mp1.agency_name AS reporter_mp_agency_name,
        mp1.agency_authorized_person AS reporter_mp_authorized_person,
        be1.business_name AS reporter_be_business_name,
        be1.authorized_person AS reporter_be_authorized_person,

        -- Reported User Names and Extra Info
        js2.full_name AS reported_js_name,
        ie2.full_name AS reported_ie_name,
        mp2.agency_name AS reported_mp_agency_name,
        mp2.agency_authorized_person AS reported_mp_authorized_person,
        be2.business_name AS reported_be_business_name,
        be2.authorized_person AS reported_be_authorized_person

      FROM reports r

      -- Reporter
      LEFT JOIN users rr ON r.reported_by = rr.user_id
      LEFT JOIN jobseeker js1 ON rr.user_id = js1.jobseeker_id
      LEFT JOIN individual_employer ie1 ON rr.user_id = ie1.individual_employer_id
      LEFT JOIN manpower_provider mp1 ON rr.user_id = mp1.manpower_provider_id
      LEFT JOIN business_employer be1 ON rr.user_id = be1.business_employer_id

      -- Reported User
      LEFT JOIN users ru ON r.reported_user_id = ru.user_id
      LEFT JOIN jobseeker js2 ON ru.user_id = js2.jobseeker_id
      LEFT JOIN individual_employer ie2 ON ru.user_id = ie2.individual_employer_id
      LEFT JOIN manpower_provider mp2 ON ru.user_id = mp2.manpower_provider_id
      LEFT JOIN business_employer be2 ON ru.user_id = be2.business_employer_id

      WHERE ru.account_status != 'restricted'
      ORDER BY r.created_at DESC
    `);

        const formattedReports = await Promise.all(rows.map(async (row) => {
            const [proofs] = await connection.query(`
                SELECT 
                  proof_id, 
                  file_url, 
                  file_type, 
                  uploaded_at 
                FROM report_proofs 
                WHERE report_id = ?
              `, [row.report_id]);

            // Reporter Details
            const reporter_name = row.reporter_js_name || row.reporter_ie_name || row.reporter_mp_authorized_person || row.reporter_be_authorized_person;
            const reporter_entity = row.reporter_js_name || row.reporter_ie_name || row.reporter_mp_agency_name || row.reporter_be_business_name;

            // Reported User Details
            const reported_name = row.reported_js_name || row.reported_ie_name || row.reported_mp_authorized_person || row.reported_be_authorized_person;
            const reported_entity = row.reported_js_name || row.reported_ie_name || row.reported_mp_agency_name || row.reported_be_business_name;

            return {
                report_id: row.report_id,
                reason: row.reason,
                message: row.message,
                created_at: format(new Date(row.created_at), "MMMM d, yyyy 'at' hh:mm a"),
                can_view: true,
                reporter: {
                    user_id: row.reporter_id,
                    role: row.reporter_role,
                    name: reporter_name,
                    entity: reporter_entity,
                },
                reported_user: {
                    user_id: row.reported_user_id,
                    role: row.reported_user_role,
                    status: row.reported_user_status,
                    name: reported_name,
                    entity: reported_entity,
                },
                proofs: proofs.map(proof => ({
                    proof_id: proof.proof_id,
                    file_url: proof.file_url,
                    file_type: proof.file_type,
                    uploaded_at: format(new Date(proof.uploaded_at), "MMMM d, yyyy 'at' hh:mm a")
                }))
            };
        }));

        return res.json(formattedReports);

    } catch (error) {
        console.error('Error fetching reported users:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    reportedUsers
}