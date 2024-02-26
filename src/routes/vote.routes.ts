import { Router } from "express";
import { castVoteHandler } from "../controller/vote.controller";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";

const router = Router();
router.post(
  "/register",
  authenticateUser,
  authorizePermissions("STUDENT"),
  castVoteHandler
);

export default router;
