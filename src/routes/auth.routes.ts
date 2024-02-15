import { Router } from "express";

import {
  forgotPassword,
  loginStudent,
  logout,
  resetPassword,
  verifyEmail,
} from "../controller/auth.controller";
import validate from "../middleware/validateResource";
import { authenticateUser } from "../middleware/authentication";

const router = Router();
router.post("/verify-email", verifyEmail);
router.post("/login", loginStudent);
router.delete("/logout", authenticateUser, logout);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

export default router;
