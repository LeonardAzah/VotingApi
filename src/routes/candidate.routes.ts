import { Router } from "express";
import {
  approveCandidateHandler,
  createCandidateHandler,
  declineCandidateHandler,
  deleteCandidateHandler,
  getCandidateByIdHandler,
  getCandidateHandler,
  getCandidatesByElectionHandler,
  updateCandidateHandler,
} from "../controller/candidate.controller";

const router = Router();

router.post("/", createCandidateHandler);
router.get("/", getCandidateHandler);
router.patch("/approve/:id", approveCandidateHandler);
router.patch("/decline/:id", declineCandidateHandler);
router.patch("/:id", updateCandidateHandler);

router.delete("/:id", deleteCandidateHandler);
router.get("/:id", getCandidatesByElectionHandler);
router.get("/:id", getCandidateByIdHandler);

export default router;
