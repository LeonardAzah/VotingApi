const express = require("express");
const router = express.Router();
const AdminSigninController = require("../server");

router.post("/", AdminSigninController.studentLogin);
module.exports = router;
