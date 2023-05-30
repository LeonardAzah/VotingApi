const express = require("express");
const facultyController = require("../../controller/facultyController");
const router = express.Router();

router.post("/", facultyController.createFaculty);
router.get("/", facultyController.getAllFaculties);
router.get("/:facultyId", facultyController.getOneFaculty);
router.patch("/:facultyId", facultyController.updateFaculty);
router.delete("/:facultyId", facultyController.deleteFaculty);

module.exports = router;
