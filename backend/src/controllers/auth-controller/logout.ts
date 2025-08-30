import type { Request, Response, RequestHandler } from "express";

export const logout: RequestHandler = async (request: Request, response: Response) => {

    try {

        response.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        });

        return response.status(200).json({
            message: "Logged out successfully",
            clearLocalStorage: true, 
        });
    } catch (error) {
        console.error("❌ Logout error:", error);
        return response.status(500).send("Logout failed");
    }
};
