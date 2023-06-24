const db = require("../../model");
//create main Model

const FacultyCandidate = db.facultyCandidate;
const Student = db.student;
const FacultyPoll = db.facultyPoll;
const Faculty = db.faculty;

// main work

// 1 create product

const createFacultyCandidate = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { name, matricule, bio } = req.body;

    // Check if the student exists based on the matricule
    const student = await Student.findOne({ where: { matricule } });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const poll = await FacultyPoll.findByPk(pollId);
    // console.log(facultyPoll);

    if (!poll) {
      return res.status(404).json({ error: "Election poll not found" });
    }

    const candidate = await FacultyCandidate.create({ name, matricule, bio });

    await candidate.setStudent(student);
    await candidate.setFacultyPoll(poll);

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: "Failed to create candidate" });
  }
};

// Get a candidate by student's matricule
const getFacultyCandidateByMatricule = async (req, res) => {
  try {
    const { matricule } = req.params;

    const candidate = await FacultyCandidate.findOne({ where: { matricule } });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidate" });
  }
};

const getAllFacultyCandidates = async (req, res) => {
  try {
    const candidates = await FacultyCandidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

const getFacultyCandidatesByPollId = async (req, res) => {
  try {
    const { pollId } = req.params;

    const electionPoll = await FacultyPoll.findByPk(pollId);

    if (!electionPoll) {
      return res.status(404).json({ error: "Election poll not found" });
    }

    const candidates = await FacultyCandidate.findAll({
      where: { faculty_poll_id: pollId },
    });

    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

// Update a candidate by student's matricule
const updateFacultyCandidateByMatricule = async (req, res) => {
  try {
    const { matricule } = req.params;
    const { name, bio } = req.body;

    const candidate = await FacultyCandidate.findOne({ where: { matricule } });

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

    const candidate = await FacultyCandidate.findOne({ where: { matricule } });

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
  createFacultyCandidate,
  getFacultyCandidateByMatricule,
  getAllFacultyCandidates,
  getFacultyCandidatesByPollId,
  updateFacultyCandidateByMatricule,
  deleteCandidateByMatricule,
};
