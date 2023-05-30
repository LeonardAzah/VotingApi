const db = require("../model");
const bycrypt = require("bcrypt");

// const Admin = db.admin;
const Student = db.student;

//create create
const createStudent = async (req, res) => {
  const { username, email, matricule, sex, dateOfBirth, password } = req.body;
  const facultyId = req.params.facultyId;
  const departmentId = req.params.departmentId;

  if (!username || !email || !matricule || !sex || !dateOfBirth || !password)
    return res.status(400).json({ message: "User details required" });

  const duplicate = await Student.findOne({ where: { matricule: matricule } });

  if (duplicate) {
    return res.status(409).json({ message: "Student already exist" });
  } else {
    try {
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
  }
};

module.exports = {
  createStudent,
};
