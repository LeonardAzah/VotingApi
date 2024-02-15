import { Router } from "express";
import {
  createFacultyElectionHandler,
  createDepartmentElectionHandler,
  getDepartmentElectionsHandler,
  getElectionByIdHandler,
  getElectionsHandler,
  getFacultyElectionsHandler,
  deleteElectionHandler,
  updateElectionHandler,
} from "../controller/election.controller";

const router = Router();
router.post("/faculty", createFacultyElectionHandler);
router.post("/department", createDepartmentElectionHandler);
router.get("/", getElectionsHandler);
router.get("/department", getDepartmentElectionsHandler);
router.get("/faculty", getFacultyElectionsHandler);
router.put("/:id", updateElectionHandler);
router.delete("/:id", deleteElectionHandler);
router.get("/:id", getElectionByIdHandler);

export default router;
