const express = require("express");
const router = express.Router();
const StudentSignupController = require("../controller/StudentSignupController");

router.post("/", StudentSignupController.createStudent);
module.exports = router;
