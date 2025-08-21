import express from "express";
import type { Request, Response, Router } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { Role } from "../types/express/auth.js";
import jwt from "jsonwebtoken";

const router: Router = express.Router();

interface AuthTokenPayload extends JwtPayload {
  user_id: number;
  role: Role;
}

router.get("/auth/verify-token", async (request: Request, response: Response) => {
  try {
    const token = request.cookies?.token as string | undefined;

    if (!token) {
      return response.status(200).json({
        authenticated: false,
        role: null,
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;

    return response.status(200).json({
      authenticated: true,
      role: decoded.role,
      user: decoded.user_id,
      message: `Authenticated as ${decoded.role}`,
    });
    
  } catch (error: any) {
    return response.status(401).json({
      authenticated: false,
      message: "Invalid or expired token",
    });
  }
});

export default router;
