const express = require("express");
const router = express.Router();
const StudentSigninController = require("../controller/adminSigninController");

router.post("/", StudentSigninController.studentLogin);
module.exports = router;
