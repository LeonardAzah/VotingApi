const db = require("../../model");
const { sequelize, DataTypes, fn } = require("sequelize");

//create main Model

const Faculty = db.faculty;
const FacultyPoll = db.facultyPoll;
const Vote = db.vote;
const FacultyCandidate = db.facultyCandidate;

// main work

// 1 create product

const createFacultyPoll = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { title, startDate, endDate } = req.body;

    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const poll = await FacultyPoll.create({
      title: title,
      startDate: startDate,
      endDate: endDate,
      active: false, // Initially set the poll as inactive
    });

    await faculty.addFacultyPoll(poll);

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: "Failed to create faculty election poll" });
  }
};

// Get a faculty election poll by ID
const getFacultyCandidatesWithVotes = async (req, res) => {
  try {
    const { pollId } = req.params;

    const candidateVotes = await Vote.findAll({
      where: { PollId: pollId },
      attributes: ["CandidateId", [fn("COUNT", "CandidateId"), "voteCount"]],
      include: [
        {
          model: FacultyCandidate,
          attributes: ["id", "name"],
        },
      ],
      group: ["CandidateId", "FacultyCandidate.id"],
    });

    res.status(200).json(candidateVotes);
  } catch (error) {
    // res.status(500).json({ error: "Failed to retrieve candidate votes" });
    res.status(500).json(error.message);
  }
};

// Update a faculty election poll
const updateFacultyPoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { title, startDate, endDate } = req.body;

    const poll = await FacultyPoll.findByPk(pollId);

    if (!poll) {
      return res.status(404).json({ error: "Faculty election poll not found" });
    }
    console.log(poll);

    await poll.update({
      title: title,
      startDate: startDate,
      endDate: endDate,
    });

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ error: "Failed to update faculty election poll" });
  }
};

// Delete a faculty election poll
const deleteFacultyPoll = async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await FacultyPoll.findByPk(pollId);

    if (!poll) {
      return res.status(404).json({ error: "Faculty election poll not found" });
    }

    await poll.destroy();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete faculty election poll" });
  }
};
module.exports = {
  createFacultyPoll,
  getFacultyCandidatesWithVotes,
  updateFacultyPoll,
  deleteFacultyPoll,
};
