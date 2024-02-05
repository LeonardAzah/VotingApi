import { Router } from "express";

import { createStudentHandler } from "../controller/studentController";
import validate from "../middleware/validateResource";
import { createStudentValidator } from "../validators/userValidator";

const router = Router();
router.post(
  "/register",
  validate(createStudentValidator),
  createStudentHandler
);

export default router;
