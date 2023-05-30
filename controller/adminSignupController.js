const db = require("../model");
const bycrypt = require("bcrypt");

const Admin = db.admin;

//create create
const createAdmin = async (req, res) => {
  const { username, email, dateOfBirth, password } = req.body;
  const facultyId = req.params.facultyId;
  const departmentId = req.params.departmentId;

  if (!username || !email || !dateOfBirth || !password)
    return res.status(400).json({ message: "Admin details required" });

  const duplicate = await Student.findOne({ where: { email: email } });

  if (duplicate) {
    return res.status(409).json({ message: "Admin already exist" });
  } else {
    try {
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
  }
};

module.exports = {
  createStudent,
};
