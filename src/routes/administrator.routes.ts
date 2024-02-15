import { Router } from "express";

import validate from "../middleware/validateResource";
import { createAdministatorHandler } from "../controller/schoolAdmin.controller";

const router = Router();
router.post("/register", createAdministatorHandler);

export default router;
