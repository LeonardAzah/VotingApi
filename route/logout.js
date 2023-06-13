const express = require("express");
const router = express.Router();
const logoutController = require("../controller/logoutController");

router.post("/", logoutController.userLogout);
router.post("/student", logoutController.userStudent);
module.exports = router;
