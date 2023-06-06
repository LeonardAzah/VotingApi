const express = require("express");
const router = express.Router();
const AdminSigninController = require("../controller/admin/adminSignupController");

router.post("/:facultyId/:departmentId", AdminSigninController.createAdmin);
module.exports = router;
