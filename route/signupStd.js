const express = require("express");
const router = express.Router();
const StudentSignupController = require("../controller/student/StudentSignupController");

router.post("/:facultyId/:departmentId", StudentSignupController.createStudent);
module.exports = router;
