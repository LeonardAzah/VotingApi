const db = require("../../model");
const { sequelize, DataTypes, fn } = require("sequelize");

//create main Model

const Faculty = db.faculty;
const FacultyPoll = db.facultyPoll;
const Vote = db.vote;
const FacultyCandidate = db.facultyCandidate;
const DepartmentalPoll = db.departmentalPoll;
const Department = db.department;
const DepartmentalCandidate = db.departmentalCandidate;
const DepartmentVote = db.departmentvote;
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

const getPollsByFaculty = async (req, res) => {
  try {
    const { facultyId, departmentId } = req.params;

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const polls = await FacultyPoll.findAll({
      where: { faculty_id: facultyId },
    });
    console.log(polls);
    const departmentpolls = await DepartmentalPoll.findAll({
      where: { department_id: departmentId },
    });
    console.log(departmentpolls);
    res.status(200).json({ polls, departmentpolls });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve polls" });
  }
};

// Get a faculty election poll by ID
const getFacultyCandidatesWithVotes = async (req, res) => {
  try {
    const { pollId } = req.params;
    const facultypoll = await FacultyPoll.findByPk(pollId);
    const deptpoll = await DepartmentalPoll.findByPk(pollId);
    if (facultypoll) {
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
    } else if (deptpoll) {
      const candidateDepartmentVotes = await DepartmentVote.findAll({
        where: { PollId: pollId },
        attributes: ["CandidateId", [fn("COUNT", "CandidateId"), "voteCount"]],
        include: [
          {
            model: DepartmentalCandidate,
            attributes: ["id", "name"],
          },
        ],
        group: ["CandidateId", "DepartmentalCandidate.id"],
      });

      res.status(200).json(candidateDepartmentVotes);
    } else {
      return res.status(404).json({ error: "Poll not found" });
    }
  } catch (error) {
    // res.status(500).json({ error: "Failed to retrieve candidate votes" });
    res.status(500).json(error.message);
  }
};
//get candidates in poll
const getCandidatesByPoll = async (req, res) => {
  try {
    const { pollId } = req.params;

    const facultypoll = await FacultyPoll.findByPk(pollId);
    const deptpoll = await DepartmentalPoll.findByPk(pollId);

    // if (!poll) {
    //   return res.status(404).json({ error: "Poll not found" });
    // }
    if (facultypoll) {
      const candidates = await FacultyCandidate.findAll({
        where: { faculty_poll_id: pollId },
      });

      res.status(200).json(candidates);
    } else if (deptpoll) {
      const candidates = await DepartmentalCandidate.findAll({
        where: { departmental_poll_id: pollId },
      });

      res.status(200).json(candidates);
    } else {
      return res.status(404).json({ error: "Poll not found" });
    }
  } catch (error) {
    // res.status(500).json({ error: "Failed to retrieve candidates" });
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
  getPollsByFaculty,
  getFacultyCandidatesWithVotes,
  getCandidatesByPoll,
  updateFacultyPoll,
  deleteFacultyPoll,
};
