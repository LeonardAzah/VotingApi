const express = require("express");
const pollController = require("../../controller/faculty/facultyPollController");
const router = express.Router();

router.post("/:facultyId", pollController.createFacultyPoll);
router.get("/:pollId", pollController.getFacultyCandidatesWithVotes);
router.put("/:pollId", pollController.updateFacultyPoll);
router.delete("/:pollId", pollController.deleteFacultyPoll);

module.exports = router;
