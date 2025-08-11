const { format } = require('date-fns');

async function getApplicantsByEmployer(connection, employerUserId, options = {}) {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(options.pageSize, 10) || 10));
  const offset = (page - 1) * pageSize;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM job_applications ja
    JOIN job_post jp ON jp.job_post_id = ja.job_post_id
    WHERE jp.user_id = ?
      AND ja.application_status != 'rejected'
  `;

  const dataQuery = `
    SELECT 
      ja.application_id,
      ja.applied_at,
      ja.job_post_id,
      u.user_id AS applicant_user_id,
      u.role AS applicant_role,
      jp.job_title,
      CASE 
        WHEN u.role = 'jobseeker' THEN js.full_name
        WHEN u.role = 'manpower-provider' THEN mp.agency_name
        ELSE 'Unknown'
      END AS applicant_name,
      CASE 
        WHEN u.role = 'jobseeker' THEN js.present_address
        WHEN u.role = 'manpower-provider' THEN mp.agency_address
        ELSE NULL
      END AS location
    FROM job_applications ja
    JOIN job_post jp ON jp.job_post_id = ja.job_post_id
    JOIN users u ON u.user_id = ja.applicant_id
    LEFT JOIN jobseeker js ON js.jobseeker_id = u.user_id
    LEFT JOIN manpower_provider mp ON mp.manpower_provider_id = u.user_id
    WHERE jp.user_id = ?
      AND ja.application_status != 'rejected'
    ORDER BY ja.applied_at DESC
    LIMIT ? OFFSET ?
  `;

  const [[{ total }]] = await connection.query(countQuery, [employerUserId]);
  const [rows] = await connection.query(dataQuery, [employerUserId, pageSize, offset]);

  return {
    total,
    page,
    pageSize,
    applicants: rows.map((row) => ({
      application_id: row.application_id,
      applied_at: row.applied_at,
      applied_at_formatted: (function () {
        try {
          if (!row.applied_at) return '-';
          const d = new Date(row.applied_at);
          if (Number.isNaN(d.getTime())) return '-';
          return format(d, "MMMM d, yyyy 'at' h:mm a");
        } catch (_) {
          return '-';
        }
      })(),
      job_post_id: row.job_post_id,
      applicant_user_id: row.applicant_user_id,
      applicant_role: row.applicant_role,
      job_title: row.job_title,
      applicant_name: row.applicant_name,
      location: row.location || '-'
    }))
  };
}

module.exports = {
  getApplicantsByEmployer
};


