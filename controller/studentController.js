const db = require("../model");
//create main Model

const Student = db.student;

// main work

//get all product
const getAllStudents = async (req, res) => {
  const result = await Student.findAll({
    attributes: ["username", "faculty", "department"],
  });
  res.status(200).send(result);
};

//get single product

const getOneStudent = async (req, res) => {
  let Id = req.params.id;
  if (!Id) return res.status(400);
  const result = await Student.findOne({ where: { id: Id } });
  res.status(200).send(result);
};

//update product

const updateStudent = async (req, res) => {
  let Id = req.params.id;
  const result = await Student.update(req.body, { where: { id: Id } });
  res.status(200).send(result);
};

//delete product
const deleteStudent = async (req, res) => {
  let Id = req.params.id;

  try {
    // Check if faculty exists
    const std = await Student.findOne({ where: { id: Id } });
    if (!std) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Delete the faculty
    const result = await Student.destroy({ where: { id: Id } });
    res.json({ success: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllStudents,
  getOneStudent,
  updateStudent,
  deleteStudent,
};
