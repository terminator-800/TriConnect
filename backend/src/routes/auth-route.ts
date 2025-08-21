import { Router } from "express";
import { login } from "../controllers/auth-controller/login.js";
import { logout } from "../controllers/auth-controller/logout.js";
import { resendVerification } from "../controllers/userController/resend-verification.js";
import { forgotPassword } from "../controllers/auth-controller/forgot-password.js";
import { resetPassword } from "../controllers/auth-controller/reset-password.js";


const router: Router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/reset-password", resetPassword);

export default router;
