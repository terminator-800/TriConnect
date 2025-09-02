import { getUncontactedAgencies, type UncontactedAgency } from "./get-uncontacted-agency.js";
import type { AuthenticatedUser } from "../../../middleware/authenticate.js";
import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import { ROLE } from "../../../utils/roles.js";
import pool from "../../../config/database-connection.js";

// Extend Express Request to include authenticated user info
interface CustomRequest extends Request {
  user?: AuthenticatedUser;
}

// API response interface
interface Agency {
  agency_id: number;
  agency_name: string;
  agency_address: string;
  agency_services: string;
  agency_authorized_person: string; // adjust if different in DB
}

export const uncontactedAgencies = async (req: CustomRequest, res: Response) => {
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    const user_id = req.user?.user_id;
    const role = req.user?.role;

    if (!user_id || !role) {
      return res.status(401).json({ message: "Unauthorized. Invalid token or user not found." });
    }

    if (
      role !== ROLE.BUSINESS_EMPLOYER &&
      role !== ROLE.INDIVIDUAL_EMPLOYER &&
      role !== ROLE.JOBSEEKER
    ) {
      return res.status(403).json({ message: "Forbidden. Only valid roles can access this resource." });
    }

    // Get uncontacted agencies from DB
    const rows: UncontactedAgency[] = await getUncontactedAgencies(connection, user_id);

    // Map DB rows to the API's Agency interface
    const agencies: Agency[] = rows.map((r) => ({
      agency_id: r.user_id, // map user_id to agency_id
      agency_name: r.agency_name,
      agency_address: r.agency_address,
      agency_services: r.agency_services,
      agency_authorized_person: r.agency_authorized_person ?? "N/A", 
    }));

    return res.json(agencies);
  } catch (error) {
    console.error("❌ Error fetching uncontacted agencies:", error);
    return res.status(500).json({ message: "Server error." });
  } finally {
    if (connection) connection.release();
  }
};
