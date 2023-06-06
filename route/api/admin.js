const express = require("express");
const adminController = require("../../controller/admin/adminController");
const router = express.Router();

router.get("/", adminController.getAllAdmins);
router.get("/:adminId", adminController.getOneAdmin);
router.get("/department/:departmentId", adminController.getAdminsByDepartment);
router.get("/faculty/:facultyId", adminController.getAdminsByFaculty);

router.patch("/:adminId", adminController.updateAdmin);
router.delete("/:adminId", adminController.deleteAdmin);

module.exports = router;
