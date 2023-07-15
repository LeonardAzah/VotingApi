const express = require("express");
const pollController = require("../../controller/faculty/facultyPollController");
const departmentalPoll = require("../../controller/department/departmentPollController");
const router = express.Router();

router.post("/:Id", pollController.createFacultyPoll);
router.get(
  "/faculty/:facultyId/department/:departmentId",
  pollController.getPollsByFaculty
);
router.get("/votes/:pollId", pollController.getFacultyCandidatesWithVotes);
router.get("/candidates/:Id", pollController.getCandidatesByPoll);
router.get("/:Id", pollController.getPollById);

router.patch("/:Id", pollController.updateFacultyPoll);
router.delete("/:pollId", pollController.deleteFacultyPoll);

router.post("/department/:departmentId", departmentalPoll.createDepartmentPoll);
router.get("/department/:departmentId", departmentalPoll.getPollsByDepartment);
router.put("/:pollId", departmentalPoll.updateDepartmentPoll);
router.delete("/:pollId", departmentalPoll.deleteDepartmentPoll);

module.exports = router;
