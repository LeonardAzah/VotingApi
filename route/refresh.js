const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controller/refreshTokenController");

router.get("/", refreshTokenController.userRefreshToken);
router.get("/student", refreshTokenController.userRefreshTokenstd);

module.exports = router;
