const express = require("express");
const router = express.Router();
const AdminSigninController = require("../controller/adminSigninController");

router.post("/", AdminSigninController.adminLogin);
module.exports = router;
