const db = require("../model");
//create main Model

const Candidate = db.candidate;
const Student = db.student;

// main work

// 1 create product

const createCandidate = async (req, res) => {
  const { matricule, bio } = req.body;
  if (!matricule || !bio)
    return res
      .status(400)
      .json({ message: "matricule and bio are required required" });

  const candidate = await Student.findOne({ where: { matricule: matricule } });

  if (duplicate) {
    return res.status(409).json({ message: "Faculty already exist" });
  } else {
    try {
      const result = await Candidate.create({
        matricule: matricule,
        bio: bio,
      });
      res.status(201).json({ result });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

//get all product
const getAllCandidates = async (req, res) => {
  const candidate = await Candidate.findAll({
    attributes: ["username", "bio"],
  });
  res.status(200).send(candidate);
};

//get single product

const getOneCandidate = async (req, res) => {
  let Id = req.params.id;
  if (!Id) return res.status(400);
  const candidate = await Candidate.findOne({ where: { id: Id } });
  res.status(200).send(candidate);
};

//update product

const updateCandidate = async (req, res) => {
  let Id = req.params.id;
  const candidate = await Candidate.update(req.body, { where: { id: Id } });
  res.status(200).send(candidate);
};

//delete product
const deleteCandidate = async (req, res) => {
  let Id = req.params.id;

  try {
    // Check if faculty exists
    const candidate = await Candidate.findOne({ where: { id: Id } });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Delete the faculty
    const result = await Candidate.destroy({ where: { id: Id } });
    res.json({ success: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createCandidate,
  getAllCandidates,
  getOneCandidate,
  updateCandidate,
  deleteCandidate,
};
