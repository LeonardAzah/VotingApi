const express = require("express");
const router = express.Router();
const AdminSigninController = require("../controller/admin/adminSigninController");

router.post("/", AdminSigninController.adminLogin);
module.exports = router;
