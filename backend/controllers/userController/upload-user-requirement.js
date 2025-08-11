const { uploadUserRequirement } = require("../../service/upload-user-requirement-service");
const { getUserInfo } = require("../../service/get-user-information-service");
const { ROLE } = require("../../utils/roles");
const pool = require("../../config/databaseConnection");
const jwt = require("jsonwebtoken");

const uploadRequirement = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const { user_id, email, role, is_registered } = decoded;

    if (!user_id || !email || !role || !is_registered) {
      await connection.rollback();
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const allowedRoles = [
      ROLE.JOBSEEKER,
      ROLE.INDIVIDUAL_EMPLOYER,
      ROLE.BUSINESS_EMPLOYER,
      ROLE.MANPOWER_PROVIDER
    ];

    if (!allowedRoles.includes(role)) {
      await connection.rollback();
      return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }

    const matchedUser = await getUserInfo(pool, user_id);

    if (
      !matchedUser ||
      matchedUser.email !== email ||
      matchedUser.role !== role ||
      !(matchedUser.is_registered === true || matchedUser.is_registered === 1)
    ) {
      await connection.rollback();
      return res.status(403).json({ message: "User validation failed" });
    }

    let payload = { user_id, role };

    switch (role) {
      case ROLE.JOBSEEKER:
        payload = {
          ...payload,
          full_name: req.body.full_name?.trim(),
          date_of_birth: req.body.date_of_birth,
          phone: req.body.contact_number?.trim(),
          gender: req.body.gender,
          present_address: req.body.present_address?.trim(),
          permanent_address: req.body.permanent_address?.trim(),
          education: req.body.education,
          skills: req.body.skills,
          government_id: req.files?.government_id?.[0]?.filename || null,
          selfie_with_id: req.files?.selfie_with_id?.[0]?.filename || null,
          nbi_barangay_clearance: req.files?.nbi_barangay_clearance?.[0]?.filename || null
        };
        break;

      case ROLE.INDIVIDUAL_EMPLOYER:
        payload = {
          ...payload,
          full_name: req.body.full_name?.trim(),
          date_of_birth: req.body.date_of_birth,
          phone: req.body.phone?.trim(),
          gender: req.body.gender,
          present_address: req.body.present_address?.trim(),
          permanent_address: req.body.permanent_address?.trim(),
          government_id: req.files?.government_id?.[0]?.filename || null,
          selfie_with_id: req.files?.selfie_with_id?.[0]?.filename || null,
          nbi_barangay_clearance: req.files?.nbi_barangay_clearance?.[0]?.filename || null
        };
        break;

      case ROLE.BUSINESS_EMPLOYER:
        payload = {
          ...payload,
          business_name: req.body.business_name?.trim(),
          business_address: req.body.business_address?.trim(),
          industry: req.body.industry,
          business_size: req.body.business_size,
          authorized_person: req.body.authorized_person?.trim(),
          authorized_person_id: req.files?.authorized_person_id?.[0]?.filename || null,
          business_permit_BIR: req.files?.business_permit_BIR?.[0]?.filename || null,
          DTI: req.files?.DTI?.[0]?.filename || null,
          business_establishment: req.files?.business_establishment?.[0]?.filename || null
        };
        break;

      case ROLE.MANPOWER_PROVIDER:
        payload = {
          ...payload,
          agency_name: req.body.agency_name?.trim(),
          agency_address: req.body.agency_address?.trim(),
          agency_services: req.body.agency_services,
          agency_authorized_person: req.body.agency_authorized_person?.trim(),
          dole_registration_number: req.files?.dole_registration_number?.[0]?.filename || null,
          mayors_permit: req.files?.mayors_permit?.[0]?.filename || null,
          agency_certificate: req.files?.agency_certificate?.[0]?.filename || null,
          authorized_person_id: req.files?.authorized_person_id?.[0]?.filename || null
        };
        break;

      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    await uploadUserRequirement(connection, payload);
    await connection.commit();
    
    return res.status(200).json({
      message: `${role.replace("-", " ")} requirements uploaded successfully`
    });

  } catch (error) {
    await connection.rollback()
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Server error during upload",
      error: error.message
    });
  } finally {
    if (connection) connection.release()
  }
};

module.exports = { uploadRequirement };
