const express = require("express");
const router = express.Router();
const StudentSigninController = require("../controller/student/studentSigninController");

router.post("/", StudentSigninController.studentLogin);
module.exports = router;
