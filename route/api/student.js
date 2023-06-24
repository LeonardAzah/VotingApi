const express = require("express");
const studentController = require("../../controller/student/studentController");
const router = express.Router();

router.post(
  "/vote/:studentId/poll/:pollId/candidate/:candidateId",
  studentController.voteForCandidate
);
router.post(
  "/vote-department/:studentId/poll/:pollId/candidate/:candidateId",
  studentController.voteForDepartmentCandidate
);
router.get("/", studentController.getAllStudents);
router.get("/:studentId", studentController.getOneStudent);
router.get(
  "/department/:departmentId",
  studentController.getStudentsByDepartment
);
router.get("/faculty/:facultyId", studentController.getStudentsByFaculty);

router.patch("/:studentId", studentController.updateStudent);
router.delete("/:studentId", studentController.deleteStudent);

module.exports = router;
