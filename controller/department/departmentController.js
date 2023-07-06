const { db } = require("../../model");
//create main Model

const Department = db.department;
const Faculty = db.faculty;

// main work

const createDepartment = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { name } = req.body;

    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const department = await Department.create({ name });
    await faculty.addDepartment(department);

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: "Failed to create department" });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({});

    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};

const getDepartmentsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findByPk(facultyId, {
      include: ["department"],
    });

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const departments = faculty.Departments;

    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};

const getOneDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    if (!departmentId)
      return res.status(400).json({ error: "Department not found" });
    const department = await Department.findByPk(departmentId);
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { name } = req.body;

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    await department.update({ name });

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update department" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    await department.destroy();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete department" });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getOneDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsByFaculty,
};
