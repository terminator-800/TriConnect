// const dbPromise = require("../config/DatabaseConnection");
// const { addMonths, format } = require('date-fns');
// const { ROLE } = require("../utils/roles")


// async function createJobPostQuery(user_id, role, job_title, job_type, salary_range, location, required_skill, job_description) {
//   try {
//     const db = await dbPromise;
//     const [result] = await db.execute(
//       `INSERT INTO job_post (user_id, role, job_title, job_type, salary_range, location, required_skill, job_description, status, submitted_at, rejection_reason, is_verified_jobpost)
//              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
//       [
//         user_id, role, job_title, job_type, salary_range, location,
//         required_skill, job_description, 'pending', null, false
//       ]
//     );

//     return { success: true, jobId: result.insertId };
//   } catch (error) {
//     console.error("Error creating job post:", error);
//     throw new Error("Failed to create job post");
//   }
// };

// // async function getApprovedJobPosts() {
// //   const db = await dbPromise;
// //   const [rows] = await db.query(`
// //     SELECT 
// //       jp.*,
// //       u.full_name,
// //       u.business_name,
// //       u.agency_name,
// //       u.authorized_person,
// //       u.agency_authorized_person
// //     FROM job_post jp
// //     JOIN users u ON jp.user_id = u.user_id
// //     WHERE jp.status = 'approved'
// //       AND jp.is_verified_jobpost = 1
// //       AND jp.jobpost_status = 'active'
// //   `);
// //   return rows;
// // };

// // const getUnappliedJobPosts = async (pool, applicant_id) => {
// //   try {
// //     const [rows] = await pool.query(`
// //       SELECT 
// //         jp.job_post_id,
// //         jp.user_id,
// //         jp.job_title,
// //         jp.job_description,
// //         jp.location,
// //         jp.salary_range,
// //         jp.required_skill,
// //         jp.job_type,
// //         jp.created_at,
// //         jp.approved_at,
// //         u.role,
// //         u.email,

// //         -- Business employer fields
// //         be.business_name,
// //         be.business_address,
// //         be.industry,
// //         be.business_size,
// //         be.authorized_person AS be_authorized_person,

// //         -- Individual employer fields
// //         ie.full_name AS ie_full_name,
// //         ie.gender AS ie_gender,
// //         ie.present_address AS ie_present_address,

// //         -- Manpower provider fields
// //         mp.agency_name,
// //         mp.agency_address,
// //         mp.agency_services,
// //         mp.agency_authorized_person

// //       FROM job_post jp
// //       JOIN users u ON jp.user_id = u.user_id

// //       LEFT JOIN business_employer be 
// //         ON u.user_id = be.business_employer_id AND u.role = 'business-employer'

// //       LEFT JOIN individual_employer ie 
// //         ON u.user_id = ie.individual_employer_id AND u.role = 'individual-employer'

// //       LEFT JOIN manpower_provider mp 
// //         ON u.user_id = mp.manpower_provider_id AND u.role = 'manpower-provider'

// //       WHERE jp.status = 'approved'
// //         AND jp.is_verified_jobpost = 1
// //         AND jp.jobpost_status = 'active'
// //         AND jp.user_id != ?
// //         AND jp.job_post_id NOT IN (
// //           SELECT job_post_id FROM job_applications WHERE applicant_id = ?
// //         )

// //       ORDER BY jp.created_at DESC;
// //     `, [applicant_id, applicant_id]);

// //     const flattened = rows.map((post) => {
// //       const base = {
// //         job_post_id: post.job_post_id,
// //         user_id: post.user_id,
// //         email: post.email,
// //         role: post.role,
// //         job_title: post.job_title,
// //         job_description: post.job_description,
// //         location: post.location,
// //         salary_range: post.salary_range,
// //         required_skill: post.required_skill,
// //         job_type: post.job_type,
// //         approved_at: post.approved_at ? format(new Date(post.approved_at), "MMMM dd, yyyy 'at' hh:mm a") : null,
// //       };

// //       if (post.role === 'individual-employer') {
// //         return {
// //           ...base,
// //           employer_name: post.ie_full_name,
// //           submitted_by: post.ie_full_name,
// //           full_name: post.ie_full_name,
// //           gender: post.ie_gender,
// //           present_address: post.ie_present_address,
// //         };
// //       }

// //       if (post.role === 'business-employer') {
// //         return {
// //           ...base,
// //           employer_name: post.business_name,
// //           submitted_by: post.be_authorized_person,
// //           business_name: post.business_name,
// //           business_address: post.business_address,
// //           industry: post.industry,
// //           business_size: post.business_size,
// //           authorized_person: post.be_authorized_person,
// //         };
// //       }

// //       if (post.role === 'manpower-provider') {
// //         return {
// //           ...base,
// //           employer_name: post.agency_name,
// //           submitted_by: post.agency_authorized_person,
// //           agency_name: post.agency_name,
// //           agency_address: post.agency_address,
// //           agency_services: post.agency_services,
// //           agency_authorized_person: post.agency_authorized_person,
// //         };
// //       }

// //       return base;
// //     });

// //     return flattened;
// //   } catch (error) {
// //     console.error('❌ Error fetching unapplied job posts:', error);
// //     throw error;
// //   }
// // };


// // async function getPendingJobPosts(connection) {
// //   const query = `
// //     SELECT 
// //       jp.job_post_id,
// //       jp.user_id,
// //       jp.job_title,
// //       jp.job_description,
// //       jp.location,
// //       jp.salary_range,
// //       jp.required_skill,
// //       jp.created_at,
// //       jp.job_type,
// //       u.role,

// //       -- Business employer fields
// //       be.business_name,
// //       be.business_address,
// //       be.industry,
// //       be.business_size,
// //       be.authorized_person AS be_authorized_person,

// //       -- Individual employer fields
// //       ie.full_name AS individual_full_name,
// //       ie.gender AS individual_gender,
// //       ie.present_address AS individual_present_address,

// //       -- Manpower provider fields
// //       mp.agency_name,
// //       mp.agency_address,
// //       mp.agency_services,
// //       mp.agency_authorized_person

// //     FROM job_post jp
// //     JOIN users u ON jp.user_id = u.user_id

// //     LEFT JOIN business_employer be 
// //       ON u.user_id = be.business_employer_id AND u.role = 'business-employer'

// //     LEFT JOIN individual_employer ie 
// //       ON u.user_id = ie.individual_employer_id AND u.role = 'individual-employer'

// //     LEFT JOIN manpower_provider mp 
// //       ON u.user_id = mp.manpower_provider_id AND u.role = 'manpower-provider'

// //     WHERE jp.jobpost_status = 'pending'
// //       AND jp.status = 'pending'

// //     ORDER BY jp.created_at DESC;
// //   `;

// //   try {
// //     const [rows] = await connection.query(query);

// //     const formatted = rows.map(post => {
// //       const base = {
// //         job_post_id: post.job_post_id,
// //         user_id: post.user_id,
// //         job_title: post.job_title,
// //         job_description: post.job_description,
// //         location: post.location,
// //         salary_range: post.salary_range,
// //         required_skill: post.required_skill,
// //         job_type: post.job_type,
// //         role: post.role,
// //         created_at: post.created_at ? format(new Date(post.created_at), "MMMM d, yyyy 'at' hh:mm a") : null
// //       };

// //       if (post.role === ROLE.BUSINESS_EMPLOYER) {
// //         return {
// //           ...base,
// //           employer_name: post.business_name,
// //           submitted_by: post.be_authorized_person,
// //           business_name: post.business_name,
// //           business_address: post.business_address,
// //           industry: post.industry,
// //           business_size: post.business_size,
// //           authorized_person: post.be_authorized_person
// //         };
// //       }

// //       if (post.role === ROLE.INDIVIDUAL_EMPLOYER) {
// //         return {
// //           ...base,
// //           employer_name: post.individual_full_name,
// //           submitted_by: post.individual_full_name,
// //           full_name: post.individual_full_name,
// //           gender: post.individual_gender,
// //           present_address: post.individual_present_address
// //         };
// //       }

// //       if (post.role === ROLE.MANPOWER_PROVIDER) {
// //         return {
// //           ...base,
// //           employer_name: post.agency_name,
// //           submitted_by: post.agency_authorized_person,
// //           agency_name: post.agency_name,
// //           agency_address: post.agency_address,
// //           agency_services: post.agency_services,
// //           agency_authorized_person: post.agency_authorized_person
// //         };
// //       }

// //       return base;
// //     });

// //     return formatted;
// //   } catch (error) {
// //     console.error('Error fetching pending job posts:', error);
// //     throw error;
// //   }
// // }


// // async function createJobPosts(pool, {
// //   user_id,
// //   role,
// //   job_title,
// //   job_type,
// //   salary_range,
// //   location,
// //   required_skill,
// //   job_description
// // }) {

// //   if (
// //     !job_title ||
// //     !job_type ||
// //     !salary_range ||
// //     !location ||
// //     !required_skill ||
// //     !job_description
// //   ) {
// //     return { error: "Please fill out all required fields." };
// //   }

// //   const validTypes = ["Full-time", "Part-time", "Contract"];
// //   if (!validTypes.includes(job_type)) {
// //     return { error: "Invalid job type." };
// //   }

// //   let connection;
// //   try {
// //     connection = await pool.getConnection();

// //     // Count non-draft, non-rejected job posts
// //     const [countRows] = await connection.execute(
// //       `SELECT COUNT(*) AS total 
// //        FROM job_post 
// //        WHERE user_id = ? 
// //        AND status NOT IN ('draft', 'rejected') 
// //        AND jobpost_status != 'deleted'
// //        `,
// //       [user_id]
// //     );

// //     const totalPosts = countRows[0].total;
// //     const maxAllowed = 3;

// //     if (totalPosts >= maxAllowed) {
// //       return {
// //         error: `You can only create up to ${maxAllowed} active job posts.`
// //       };
// //     }

// //     // Insert new job post
// //     const [result] = await connection.execute(
// //       `INSERT INTO job_post (
// //         user_id, role, job_title, job_type, salary_range,
// //         location, required_skill, job_description,
// //         status, submitted_at, rejection_reason, is_verified_jobpost, jobpost_status
// //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NULL, false, 'pending')`,
// //       [
// //         user_id,
// //         role,
// //         job_title,
// //         job_type,
// //         salary_range,
// //         location,
// //         required_skill,
// //         job_description
// //       ]
// //     );

// //     return {
// //       success: true,
// //       job_post_id: result.insertId,
// //       message: "Job post created successfully."
// //     };

// //   } catch (error) {
// //     return { error: "Database error occurred.", details: error.message };
// //   } finally {
// //     if (connection) connection.release();
// //   }
// // }


// // async function getJobPostsByUserGrouped(pool, user_id) {
// //   const connection = await pool.getConnection();

// //   try {
// //     // Fetch user verification status
// //     const [[userStatus]] = await connection.query(
// //       `
// //       SELECT 
// //         is_verified,
// //         is_rejected,
// //         is_submitted
// //       FROM users
// //       WHERE user_id = ?
// //       `,
// //       [user_id]
// //     );

// //     // Fetch grouped job posts
// //     const [rows] = await connection.query(
// //       `
// //       SELECT 
// //         jp.job_post_id,
// //         jp.user_id,
// //         jp.job_title,
// //         jp.job_description,
// //         jp.location,
// //         jp.salary_range,
// //         jp.status,
// //         jp.created_at,
// //         jp.job_type,
// //         jp.jobpost_status,
// //         u.role,

// //         CASE 
// //           WHEN u.role = 'business-employer' THEN be.business_name
// //           WHEN u.role = 'manpower-provider' THEN mp.agency_name
// //           WHEN u.role = 'individual-employer' THEN ie.full_name
// //           ELSE NULL
// //         END AS employer_name,

// //         CASE 
// //           WHEN u.role = 'business-employer' THEN be.authorized_person
// //           WHEN u.role = 'manpower-provider' THEN mp.agency_authorized_person
// //           WHEN u.role = 'individual-employer' THEN ie.full_name
// //           ELSE NULL
// //         END AS authorized_person,

// //         COUNT(ja.application_id) AS applicant_count,

// //         CASE
// //           WHEN jp.status = 'pending' AND (jp.jobpost_status != 'deleted' OR jp.jobpost_status IS NULL)
// //             THEN 'pending'
// //           WHEN jp.status = 'approved' AND jp.jobpost_status IN ('active', 'paused')
// //             THEN 'active'
// //           WHEN jp.status = 'approved' AND jp.jobpost_status = 'completed'
// //             THEN 'completed'
// //           ELSE NULL
// //         END AS category

// //       FROM job_post jp
// //       JOIN users u ON jp.user_id = u.user_id
// //       LEFT JOIN business_employer be ON u.user_id = be.business_employer_id
// //       LEFT JOIN manpower_provider mp ON u.user_id = mp.manpower_provider_id
// //       LEFT JOIN individual_employer ie ON u.user_id = ie.individual_employer_id
// //       LEFT JOIN job_applications ja ON jp.job_post_id = ja.job_post_id

// //       WHERE jp.user_id = ?
// //         AND (jp.jobpost_status != 'deleted' OR jp.jobpost_status IS NULL)
// //         AND (
// //           (jp.status = 'pending') OR
// //           (jp.status = 'approved' AND jp.jobpost_status IN ('active', 'paused', 'completed'))
// //         )

// //       GROUP BY jp.job_post_id
// //       ORDER BY jp.created_at DESC
// //       `,
// //       [user_id]
// //     );

// //     const grouped = { pending: [], active: [], completed: [] };

// //     for (const row of rows) {
// //       if (row.created_at) {
// //         row.created_at = format(new Date(row.created_at), "MMMM d, yyyy 'at' h:mm a");
// //       }
// //       if (row.category) {
// //         grouped[row.category].push(row);
// //       }
// //     }

// //     return {
// //       is_verified: !!userStatus?.is_verified,
// //       is_rejected: !!userStatus?.is_rejected,
// //       is_submitted: !!userStatus?.is_submitted,
// //       ...grouped
// //     };
// //   } catch (error) {
// //     console.error('❌ Error fetching job posts by user:', error);
// //     throw error;
// //   } finally {
// //     connection.release();
// //   }
// // }


// // async function softDeleteJobPostById(jobPostId) {
// //   const expiresAt = addMonths(new Date(), 1);

// //   const db = await dbPromise;

// //   const softDeleteQuery = `
// //     UPDATE job_post 
// //     SET jobpost_status = ?, expires_at = ? 
// //     WHERE job_post_id = ?
// //   `;

// //   const [result] = await db.query(softDeleteQuery, ['deleted', expiresAt, jobPostId]);
// //   return result;
// // };

// module.exports = {
//   createJobPostQuery,
//   // getApprovedJobPosts,
//   // getUnappliedJobPosts,
//   // getJobPostsByUserGrouped,
//   // getPendingJobPosts,
//   // createJobPosts,
//   // getJobPostById,
//   // softDeleteJobPostById,
// }



