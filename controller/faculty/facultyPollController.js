const { db, sequelize } = require("../../model");
const { Sequelize, DataTypes, fn } = require("sequelize");

//create main Model

const Faculty = db.faculty;
const FacultyPoll = db.facultyPoll;
const Vote = db.vote;
const FacultyCandidate = db.facultyCandidate;
const DepartmentalPoll = db.departmentalPoll;
const Department = db.department;
const DepartmentalCandidate = db.departmentalCandidate;
const DepartmentVote = db.departmentvote;
const DepartmentPoll = db.departmentalPoll;

// main work

// 1 create product

const createFacultyPoll = async (req, res) => {
  try {
    const { Id } = req.params;
    const { title, startDate, endDate } = req.body;
    console.log(title, startDate, endDate);

    const faculty = await Faculty.findByPk(Id);
    const department = await Department.findByPk(Id);
    if (faculty) {
      const duplicate = await FacultyPoll.findOne({ where: { title: title } });
      if (duplicate) {
        return res.status(409).json({ error: "Election poll already exist" });
      }

      const poll = await FacultyPoll.create({
        title: title,
        startDate: startDate,
        endDate: endDate,
        active: false, // Initially set the poll as inactive
      });

      await faculty.addFacultyPoll(poll);

      res.status(201).json({ message: "Election created successfully" });
    } else if (department) {
      const duplicate = await DepartmentPoll.findOne({
        where: { title: title },
      });
      if (duplicate) {
        return res.status(409).json({ message: "Election poll already exist" });
      }

      const poll = await DepartmentPoll.create({
        title: title,
        startDate: startDate,
        endDate: endDate,
        active: false, // Initially set the poll as inactive
      });

      await department.addDepartmentPoll(poll);

      res.status(201).json({ message: "Election created successfully" });
    } else {
      return res.status(404).json({ error: "Not found" });
    }
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
      const facultyCandidateVotes = await sequelize.query(
        `SELECT FacultyCandidates.id, FacultyCandidates.name, COUNT(Votes.CandidateId) AS voteCount
      FROM FacultyCandidates
      LEFT JOIN Votes ON Votes.CandidateId = FacultyCandidates.id
      WHERE FacultyCandidates.faculty_poll_id = :pollId
      GROUP BY FacultyCandidates.id
      ORDER BY voteCount DESC`,
        {
          replacements: { pollId },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res.status(200).json(facultyCandidateVotes);
    } else if (deptpoll) {
      const candidateDepartmentVotes = await sequelize.query(
        `SELECT DepartmentalCandidates.id,  DepartmentalCandidates.name, COUNT(DepartmentVotes.CandidateId) AS voteCount
        FROM DepartmentalCandidates
        LEFT JOIN DepartmentVotes ON DepartmentVotes.CandidateId = DepartmentalCandidates.id
        WHERE DepartmentalCandidates.departmental_poll_id = :pollId
        GROUP BY DepartmentalCandidates.id
        ORDER BY voteCount DESC`,
        {
          replacements: { pollId },
          type: sequelize.QueryTypes.SELECT,
        }
      );

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
    const { Id } = req.params;

    const facultypoll = await FacultyPoll.findByPk(Id);
    const deptpoll = await DepartmentalPoll.findByPk(Id);

    if (facultypoll) {
      const candidates = await FacultyCandidate.findAll({
        where: { faculty_poll_id: Id },
      });

      res.status(200).json(candidates);
    } else if (deptpoll) {
      const candidates = await DepartmentalCandidate.findAll({
        where: { departmental_poll_id: Id },
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
