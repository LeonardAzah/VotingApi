import { Router } from "express";
import {
  createDepartmentHandler,
  getDepartmentByIdHandler,
  getDepartmentsHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
} from "../controller/departmentController";
import validateResource from "../middleware/validateResource";
import {
  createDepartmentSchema,
  deleteDepartmentSchema,
  getDepartmentSchema,
  updateDepartmentSchema,
} from "../shema/department.schema";
const router = Router();

router.post(
  "/",
  validateResource(createDepartmentSchema),
  createDepartmentHandler
);
router.get("/", getDepartmentsHandler);
router.put(
  "/:id",
  validateResource(updateDepartmentSchema),
  updateDepartmentHandler
);
router.delete(
  "/:id",
  validateResource(deleteDepartmentSchema),
  deleteDepartmentHandler
);
router.get(
  "/:id",
  validateResource(getDepartmentSchema),
  getDepartmentByIdHandler
);

export default router;
