import { Router } from "express";
import {
  createDepartmentHandler,
  getDepartmentByIdHandler,
  getDepartmentsHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
} from "../controller/department.controller";
import validateResource from "../middleware/validateResource";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";

const router = Router();

router.post("/", createDepartmentHandler);
router.get("/", getDepartmentsHandler);
router.put("/:id", updateDepartmentHandler);
router.delete("/:id", deleteDepartmentHandler);
router.get("/:id", getDepartmentByIdHandler);

export default router;
