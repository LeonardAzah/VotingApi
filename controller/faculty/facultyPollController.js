const db = require("../../model");
//create main Model

const Faculty = db.faculty;
const FacultyPoll = db.facultyPoll;

// main work

// 1 create product

const createFacultyPoll = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { title, startTime, endTime } = req.body;

    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const poll = await FacultyPoll.create({
      title,
      startTime,
      endTime,
      active: false, // Initially set the poll as inactive
    });

    await faculty.addFacultyPoll(poll);

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: "Failed to create faculty election poll" });
  }
};

// Get a faculty election poll by ID
const getFacultyPollById = async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await FacultyPoll.findByPk(pollId, {
      include: [Faculty],
    });

    if (!poll) {
      return res.status(404).json({ error: "Faculty election poll not found" });
    }

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch faculty election poll" });
  }
};

// Update a faculty election poll
const updateFacultyPoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { title, startTime, endTime } = req.body;

    const poll = await FacultyPoll.findByPk(pollId, {
      include: [Faculty],
    });

    if (!poll) {
      return res.status(404).json({ error: "Faculty election poll not found" });
    }

    await poll.update({
      title,
      startTime,
      endTime,
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
  getFacultyPollById,
  updateFacultyPoll,
  deleteFacultyPoll,
};
