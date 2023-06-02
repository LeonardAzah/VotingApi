const db = require("../../model");
//create main Model

const DepartmentCandidate = db.departmentalCandidate;
const Student = db.student;
const DepartmetnPoll = db.departmentalPoll;

// main work

// 1 create product

const createDepartmentCandidate = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { name, matricule, bio } = req.body;

    // Check if the student exists
    const student = await Student.findOne({ where: { matricule } });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const electionPoll = await DepartmetnPoll.findByPk(pollId);

    if (!electionPoll) {
      return res.status(404).json({ error: "Election poll not found" });
    }

    const candidate = await DepartmentCandidate.create({
      name,
      bio,
      matricule,
    });

    await electionPoll.addCandidate(candidate);
    await student.addCandidate(candidate);

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: "Failed to create candidate" });
  }
};

// Get a candidate by student's matricule
const getDepartmentCandidateByMatricule = async (req, res) => {
  try {
    const { matricule } = req.params;

    const candidate = await DepartmentCandidate.findOne({
      where: { matricule },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidate" });
  }
};

const getAllDepartmentCandidates = async (req, res) => {
  try {
    const candidates = await DepartmentCandidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

const getDepartmentCandidatesByPollId = async (req, res) => {
  try {
    const { pollId } = req.params;

    const electionPoll = await DepartmentCandidate.findByPk(pollId, {
      include: [{ model: DepartmentCandidate }],
    });

    if (!electionPoll) {
      return res.status(404).json({ error: "Faculty election poll not found" });
    }

    const candidates = DepartmetnPoll.DepartmentCandidate;

    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

// Update a candidate by student's matricule
const updateDepartmentCandidateByMatricule = async (req, res) => {
  try {
    const { matricule } = req.params;
    const { name, bio } = req.body;

    const candidate = await DepartmentCandidate.findOne({
      where: { matricule },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    await candidate.update({ name, bio });

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ error: "Failed to update candidate" });
  }
};

// Delete a candidate by student's matricule
const deleteCandidateByMatricule = async (req, res) => {
  try {
    const { matricule } = req.params;

    const candidate = await DepartmentCandidate.findOne({
      where: { matricule },
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    await candidate.destroy();

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete candidate" });
  }
};

module.exports = {
  createDepartmentCandidate,
  getDepartmentCandidateByMatricule,
  getAllDepartmentCandidates,
  getDepartmentCandidatesByPollId,
  updateDepartmentCandidateByMatricule,
  deleteCandidateByMatricule,
};
