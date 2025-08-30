// const { format } = require('date-fns');
// const { getRoleConfig, deleteUserFilesAndFolders } = require('../helpers/reject-user-helper');


// // const findOrCreateAdmin = async (pool, { email, hashedPassword }) => {
// //   const connection = await pool.getConnection();
// //   try {
// //     const [rows] = await connection.execute(
// //       `SELECT * FROM users 
// //        WHERE email = ? 
// //        AND role = 'administrator'`,
// //       [email]
// //     );

// //     if (rows.length > 0) {
// //       return { alreadyExists: true, user: rows[0] };
// //     }

// //     const [result] = await connection.execute(
// //       `INSERT INTO users (
// //         email, 
// //         password, 
// //         role, 
// //         is_registered,
// //         is_verified,
// //         is_submitted,
// //         verified_at
// //       ) VALUES (?, ?, 'administrator', ?, ?, ?, NOW())`,
// //       [email, hashedPassword, 1, 1, 1]
// //     );

// //     return {
// //       alreadyExists: false,
// //       user: {
// //         user_id: result.insertId,
// //         email,
// //         role: 'administrator',
// //         is_registered: 1,
// //         is_verified: 1,
// //         is_submitted: 1,
// //         verified_at: new Date().toISOString(),
// //       },
// //     };
// //   } catch (error) {
// //     console.error("Error in findOrCreateAdmin:", error);
// //     throw error;
// //   } finally {
// //     connection.release();
// //   }
// // };



// // async function verifyUsers(pool, user_id) {
// //   const connection = await pool.getConnection();
// //   try {
// //     const [userRows] = await connection.execute(
// //       `SELECT user_id FROM users WHERE user_id = ?`,
// //       [user_id]
// //     );
// //     if (userRows.length === 0) {
// //       throw new Error('User not found.');
// //     }

// //     const [updateResult] = await connection.execute(
// //       `UPDATE users 
// //              SET is_verified = ?, is_rejected = ?, verified_at = NOW() 
// //              WHERE user_id = ?`,
// //       [true, false, user_id]
// //     );

// //     if (updateResult.affectedRows === 0) {
// //       throw new Error('User verification failed in users table.');
// //     }

// //     return { success: true, user_id };
// //   } catch (error) {
// //     console.error("Error verifying user:", error);
// //     throw error;
// //   } finally {
// //     connection.release();
// //   }
// // }

// // async function rejectUsers(pool, user_id) {
// //   const connection = await pool.getConnection();
// //   try {
// //     const [userRows] = await connection.execute(
// //       `SELECT role FROM users WHERE user_id = ?`, [user_id]
// //     );
// //     if (!userRows.length) throw new Error("User not found.");

// //     const role = userRows[0].role;
// //     const { table, idField, resetFields, fileFields } = getRoleConfig(role);

// //     const [existingRows] = await connection.execute(
// //       `SELECT ${resetFields.join(", ")} FROM ${table} WHERE ${idField} = ?`, [user_id]
// //     );
// //     const existingData = existingRows[0] || {};

// //     const displayName = existingData.full_name || existingData.business_name || existingData.agency_name;
// //     const fileList = fileFields.map(field => existingData[field]).filter(Boolean);

// //     await deleteUserFilesAndFolders(role, user_id, displayName, fileList);

// //     const resetQuery = `
// //       UPDATE ${table}
// //       SET ${resetFields.map(f => `${f} = NULL`).join(", ")}
// //       WHERE ${idField} = ?
// //     `;
// //     await connection.execute(resetQuery, [user_id]);

// //     // Update user table status
// //     const userStatusQuery = `
// //       UPDATE users
// //       SET is_verified = false,
// //           is_submitted = false,
// //           is_rejected = true,
// //           verified_at = NULL
// //       WHERE user_id = ?
// //     `;
// //     await connection.execute(userStatusQuery, [user_id]);

// //     return {
// //       success: true,
// //       message: `${role} requirements rejected, files and folders removed, and rejection recorded.`
// //     };

// //   } catch (error) {
// //     console.error("Error rejecting user:", error);
// //     throw error;
// //   } finally {
// //     connection.release();
// //   }
// // }

// // async function rejectJobPostIfExists(pool, jobPostId) {
// //   const connection = await pool.getConnection();
// //   try {
// //     const jobPost = await getJobPostById(pool, jobPostId);
// //     if (!jobPost) {
// //       return { success: false, message: 'Jobpost not found.' };
// //     }

// //     await connection.query(
// //       `UPDATE job_post 
// //        SET 
// //          status = 'rejected', 
// //          is_verified_jobpost = FALSE
// //        WHERE job_post_id = ?`,
// //       [jobPostId]
// //     );

// //     return { success: true, message: 'Jobpost rejected successfully.' };
// //   } catch (error) {
// //     console.error("Error in rejectJobPostIfExists:", error);
// //     throw error;
// //   } finally {
// //     connection.release();
// //   }
// // };

// // async function getJobPostById(connection, jobPostId) {
// //   try {
// //     const [rows] = await connection.query(
// //       `SELECT * FROM job_post 
// //        WHERE job_post_id = ?`,
// //       [jobPostId]
// //     );
// //     return rows[0] || null;
// //   } catch (error) {
// //     console.error("Error in getJobPostById:", error);
// //     throw error;
// //   } finally {
// //     connection.release();
// //   }
// // };

// // async function approveJobPostIfExists(pool, jobPostId) {
// //   const connection = await pool.getConnection();
// //   try {
// //     const jobPost = await getJobPostById(pool, jobPostId);
// //     if (!jobPost) {
// //       return { success: false, message: 'Jobpost not found.' };
// //     }

// //     await connection.query(
// //       `UPDATE job_post
// //        SET 
// //          status = 'approved',
// //          jobpost_status = 'active',
// //          rejection_reason = NULL,
// //          approved_at = NOW(),
// //          is_verified_jobpost = TRUE
// //        WHERE job_post_id = ?`,
// //       [jobPostId]
// //     );

// //     return { success: true, message: 'Jobpost approved successfully.' };
// //   } catch (error) {
// //     console.error("Error in approveJobPostIfExists:", error);
// //     throw error;
// //   } finally {
// //     connection.release();
// //   }
// // };

// // async function getUserFeedbacks(connection) {
// //   const [rows] = await connection.query(`
// //     SELECT
// //       feedback.feedback_id,
// //       feedback.user_id,
// //       feedback.role,
// //       feedback.message,
// //       DATE_FORMAT(feedback.created_at, '%Y %m %d, %h:%i %p') AS submitted_at,
// //       CASE
// //         WHEN feedback.role = 'jobseeker' THEN jobseeker.full_name
// //         WHEN feedback.role = 'business-employer' THEN business_employer.business_name
// //         WHEN feedback.role = 'individual-employer' THEN individual_employer.full_name
// //         WHEN feedback.role = 'manpower-provider' THEN manpower_provider.agency_name 
// //         ELSE NULL
// //       END AS user_name
// //     FROM feedback feedback
// //     LEFT JOIN jobseeker jobseeker ON feedback.user_id = jobseeker.jobseeker_id
// //     LEFT JOIN business_employer business_employer ON feedback.user_id = business_employer.business_employer_id
// //     LEFT JOIN individual_employer individual_employer ON feedback.user_id = individual_employer.individual_employer_id
// //     LEFT JOIN manpower_provider manpower_provider ON feedback.user_id = manpower_provider.manpower_provider_id
// //     ORDER BY feedback.created_at DESC
// //   `);
// //   return rows;
// // }


// module.exports = {
//   // findOrCreateAdmin,
//   // verifyUsers,
//   // rejectUsers,
//   // rejectJobPostIfExists,
//   // approveJobPostIfExists,
//   // getSubmittedUsers,
//   // getUserFeedbacks,
//   // getJobPostById
// };
