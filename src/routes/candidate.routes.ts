import { Router } from "express";
import {
  createCandidateHandler,
  deleteCandidateHandler,
  getCandidateByIdHandler,
  getCandidateHandler,
  getCandidatesByElectionHandler,
  updateCandidateHandler,
} from "../controller/candidate.controller";

const router = Router();

router.post("/", createCandidateHandler);
router.get("/", getCandidateHandler);
router.put("/:id", updateCandidateHandler);

router.delete("/:id", deleteCandidateHandler);
router.get("/:id", getCandidatesByElectionHandler);
router.get("/:id", getCandidateByIdHandler);

export default router;
