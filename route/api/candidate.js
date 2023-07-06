const express = require("express");
const candidateController = require("../../controller/candidate/facultyCandidateController");
const departmentalCandidate = require("../../controller/candidate/departmentCandidateController");
const router = express.Router();

router.post("/:pollId", candidateController.createFacultyCandidate);
router.get("/", candidateController.getAllFacultyCandidates);
router.get("/:Id", candidateController.getFacultyCandidateByMatricule);
router.get("/byPoll/:pollId", candidateController.getFacultyCandidatesByPollId);

router.patch("/:Id", candidateController.updateFacultyCandidateByMatricule);
router.delete("/:Id", candidateController.deleteCandidateByMatricule);

router.post(
  "/department/:pollId",
  departmentalCandidate.createDepartmentCandidate
);
router.get("/department", departmentalCandidate.getAllDepartmentCandidates);
router.get(
  "/department/:matricule",
  departmentalCandidate.getDepartmentCandidateByMatricule
);
router.get(
  "/department/:pollId",
  departmentalCandidate.getDepartmentCandidatesByPollId
);
router.patch(
  "/department/:matricule",
  departmentalCandidate.updateDepartmentCandidateByMatricule
);
router.delete(
  "/department/:matricule",
  departmentalCandidate.deleteCandidateByMatricule
);

module.exports = router;
