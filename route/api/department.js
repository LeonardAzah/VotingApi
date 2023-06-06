const express = require("express");
const router = express.Router();
const departmentController = require("../../controller/department/departmentController");

router.post(
  "/faculties/:facultyId/departments",
  departmentController.createDepartment
);
router.get("/departments", departmentController.getAllDepartments);
router.get(
  "/faculties/:facultyId/departments",
  departmentController.getDepartmentsByFaculty
);
router.patch(
  "/departments/:departmentId",
  departmentController.updateDepartment
);
router.delete(
  "/departments/:departmetnId",
  departmentController.deleteDepartment
);

module.exports = router;
