const express = require("express");
const candidateController = require("../../controller/candidate/facultyCandidateController");
const router = express.Router();

router.post("/:pollId", candidateController.createFacultyCandidate);
router.get("/", candidateController.getAllFacultyCandidates);
router.get("/:matricule", candidateController.getFacultyCandidateByMatricule);
router.get("/:pollId", candidateController.getFacultyCandidatesByPollId);

router.patch(
  "/:matricule",
  candidateController.updateFacultyCandidateByMatricule
);
router.delete("/:matricule", candidateController.deleteCandidateByMatricule);

module.exports = router;
