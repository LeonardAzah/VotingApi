const { db } = require("../../model");
//create main Model

const Admin = db.admin;
const Faculty = db.faculty;
const Department = db.department;

// main work

//get all product
const getAllAdmins = async (req, res) => {
  try {
    const admin = await Admin.findAll();

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: "Failed to admins" });
  }
};

const getAdminsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const admin = await admin.getAdmins();

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

const getAdminsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const admins = await department.getAdmins();

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

//get single product

const getOneAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    if (!adminId) return res.status(400).json({ error: "Admin not found" });
    const admin = await Admin.findByPk(adminId);
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin" });
  }
};

//update product

const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    await admin.update(req.body);

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: "Failed to update admin" });
  }
};

//delete product
const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    await admin.destroy();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete admin" });
  }
};

module.exports = {
  getAllAdmins,
  getOneAdmin,
  getAdminsByDepartment,
  getAdminsByFaculty,
  updateAdmin,
  deleteAdmin,
};
