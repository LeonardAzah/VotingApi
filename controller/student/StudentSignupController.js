const db = require("../../model");
const bycrypt = require("bcrypt");

const Student = db.student;
const Faculty = db.faculty;
const Department = db.department;

//create create
const createStudent = async (req, res) => {
  try {
    const { username, email, matricule, sex, dateOfBirth, password } = req.body;
    const { facultyId, departmentId } = req.params;

    if (!username || !email || !matricule || !sex || !dateOfBirth || !password)
      return res.status(400).json({ message: "User details required" });

    const duplicate = await Student.findOne({
      where: { matricule: matricule },
    });

    if (duplicate) {
      return res.status(409).json({ message: "Student already exist" });
    }

    const faculty = await Faculty.findByPk(facultyId);
    const department = await Department.findByPk(departmentId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const hashedPwd = await bycrypt.hash(password, 10);
    const result = await Student.create({
      username: username,
      email: email,
      matricule: matricule,
      sex: sex,
      dateOfBirth: dateOfBirth,
      faculty: facultyId,
      department: departmentId,
      password: hashedPwd,
    });
    res.status(201).json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createStudent,
};

createStudent = async (req, res) => {
  try {
    const { facultyId, departmentId } = req.params;
    const { name } = req.body;

    const faculty = await Faculty.findByPk(facultyId);
    const department = await Department.findByPk(departmentId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const student = await Student.create({ name });
    await student.setDepartment(department);

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to create student" });
  }
};
