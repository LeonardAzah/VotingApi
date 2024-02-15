import { Router } from "express";
import {
  createFacultyHandler,
  deleteFacultyHandler,
  getFacultiesHandler,
  getFacultyByIdHandler,
  updateFacultyHandler,
} from "../controller/faculty.controller";
import validateResource from "../middleware/validateResource";

const router = Router();
router.post("/", createFacultyHandler);
router.get("/", getFacultiesHandler);
router.put("/:id", updateFacultyHandler);
router.delete("/:id", deleteFacultyHandler);
router.get("/:id", getFacultyByIdHandler);

export default router;
