import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from "express";
import type { PoolConnection } from "mysql2/promise";
import { findUsersEmail } from "../../../service/find-user-email-service.js";
import { createUsers } from "./create-user.js";
import type { User } from "../../../interface/interface.js";
import { ROLE } from "../../../utils/roles.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import logger from "../../../config/logger.js";
import pool from "../../../config/database-connection.js";
import jwt from "jsonwebtoken";

const { CLIENT_ORIGIN, JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;

if (!CLIENT_ORIGIN || !JWT_SECRET || !EMAIL_USER || !EMAIL_PASS) {
  logger.error("Missing required environment variables for registerUser");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const allowedRoles: Partial<Record<keyof typeof ROLE, string>> = {
  [ROLE.BUSINESS_EMPLOYER]: "business employer",
  [ROLE.INDIVIDUAL_EMPLOYER]: "individual employer",
  [ROLE.JOBSEEKER]: "jobseeker",
  [ROLE.MANPOWER_PROVIDER]: "manpower provider",
};

interface RegisterUserBody {
  email: string;
  role: keyof typeof ROLE;
  password: string;
}

interface JwtPayload {
  email: string;
  role: keyof typeof ROLE;
}

export const registerUser = async (request: Request<unknown, unknown, RegisterUserBody>, response: Response) => {
  let connection: PoolConnection | undefined;
  type AllowedRoleKey = keyof typeof ROLE;
  const ip = request.ip;

  const { email, role, password } = request.body as { email: string; role: AllowedRoleKey; password: string };

  if (!email || !role || !password) {
    logger.warn("Missing required fields in registerUser", { email, role, ip });
    return response.status(400).json({ message: "Missing email, role, or password." });
  }

  if (!(role in allowedRoles)) {
    logger.warn("Invalid role type in registerUser", { role, ip });
    return response.status(400).json({ message: "Invalid role type." });
  }

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const existingUser: User | null = await findUsersEmail(connection, email);

    if (existingUser) {
      logger.warn("Attempt to register with existing email", { email, ip });
      await connection.rollback();
      return response.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await createUsers(connection, email, hashedPassword, role);

    if (!result.success || !result.user_id) {
      logger.error("Failed to create user", { result, email, role, ip });
      await connection.rollback();
      return response.status(500).json({ message: "Failed to create user." });
    }

    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: "1h" });
    const verificationLink = `${process.env.API_BASE_URL}/${role}/verify?token=${token}`;
    const emailSubject = `Verify your ${allowedRoles[role]} email`;

    const htmlMessage = `
      <p>Hello,</p>
      <p>Please verify your email address to complete registration as a <strong>${allowedRoles[role]}</strong>.</p>
      <p>Click the link below to verify:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await transporter.sendMail({
      from: `"TriConnect" <${EMAIL_USER}>`,
      to: email,
      subject: emailSubject,
      html: htmlMessage,
    });

    await connection.commit();

    return response.status(201).json({
      message: "Verification email sent. Please check your inbox.",
    });

  } catch (error: unknown) {
    logger.error("Unexpected error in registerUser", { error, email, role, ip });
    if (connection) connection.rollback();
    return response.status(500).json({ message: "Server error." });

  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        logger.error("Failed to release DB connection in registerUser", { releaseError, email, role, ip });
      }
    }
  }
};


