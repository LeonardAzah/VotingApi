const db = require("../../model");
const bycrypt = require("bcrypt");

const Admin = db.admin;
const Faculty = db.faculty;
const Department = db.department;

//create create
const createAdmin = async (req, res) => {
  try {
    const { username, email, dateOfBirth, password } = req.body;
    const { facultyId, departmentId } = req.params;

    if (!username || !email || !dateOfBirth || !password)
      return res.status(400).json({ message: "Admin details required" });

    const duplicate = await Student.findOne({ where: { email: email } });

    if (duplicate)
      return res.status(409).json({ message: "Admin already exist" });

    const faculty = await Faculty.findByPk(facultyId);
    const department = await Department.findByPk(departmentId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const hashedPwd = await bycrypt.hash(password, 10);
    const result = await Admin.create({
      username: username,
      email: email,
      dateOfBirth: dateOfBirth,
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
