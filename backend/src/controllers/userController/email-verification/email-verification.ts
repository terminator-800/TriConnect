import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from 'express';
import type { PoolConnection } from "mysql2/promise";
import { findUsersEmail } from "../../../service/find-user-email-service.js";
import { markRegistered } from "../../userController/email-verification/mark-registered-service.js";
import { ROLE } from '../../../utils/roles.js'
import type { User } from '../../../interface/interface.js';
import jwt from "jsonwebtoken";
import pool from "../../../config/database-connection.js";

interface JwtPayload {
  email: string;
  role: keyof typeof ROLE;
}

export const verifyEmail = async (request: Request<{}, {}, {}, { token?: string }>, response: Response) => {
  let connection: PoolConnection | undefined;
  const { token } = request.query;

  if (!token || Array.isArray(token)) {
    return response.status(400).send("Missing or invalid token.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in environment variables");
  }

  const tokenString: string = token;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET!) as JwtPayload;

    const { email, role } = decoded;

    if (!email || !role || !Object.values(ROLE).includes(role)) {
      return response.status(400).send("Invalid token payload.");
    }

    const user: User | null = await findUsersEmail(connection, email);

    if (!user) return response.status(404).send("User not found.");
    if (user.is_registered) return response.status(200).send("User already verified.");

    await markRegistered(connection, email);
    await connection.commit();

    return response.status(200).send("Email verified and account registered!");

  } catch (error: unknown) {

    if (connection) await connection.rollback();
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Verification error:", message);
    return response.status(400).send("Invalid or expired verification link.");

  } finally {
    connection?.release();
  }
};
