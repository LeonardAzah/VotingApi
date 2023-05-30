const db = require("../model");
//create main Model

const Faculty = db.faculty;
const Department = db.department;

// main work

const createFaculty = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Faculty name required" });

  const duplicate = await Faculty.findOne({ where: { name: name } });

  if (duplicate) {
    return res.status(409).json({ message: "Faculty already exist" });
  } else {
    try {
      const result = await Faculty.create({
        name: name,
      });
      res.status(201).json({ result });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

const getAllFaculties = async (req, res) => {
  try {
    const faculty = await Faculty.findAll({ include: ["department"] });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch faculties" });
  }
};

const getOneFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    if (!facultyId) return res.status(400).json({ error: "Faculty not found" });
    const faculty = await Faculty.findByPk(facultyId, {
      include: ["department"],
    });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { name } = req.body;
    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    await faculty.update({ name });

    res.status(200).json({ message: "Updated sucessfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update faculty" });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    await faculty.destroy();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete faculty" });
  }
};

module.exports = {
  createFaculty,
  getAllFaculties,
  getOneFaculty,
  updateFaculty,
  deleteFaculty,
};
