const db = require("../../model");
//create main Model

const Department = db.department;
const DepartmentPoll = db.departmentalPoll;

// main work

// 1 create product

const createDepartmentPoll = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { title, startTime, endTime } = req.body;

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const poll = await DepartmentPoll.create({
      title,
      startTime,
      endTime,
      active: false, // Initially set the poll as inactive
    });

    await department.addFacultyPoll(poll);

    res.status(201).json(poll);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create department election poll" });
  }
};

// Get a faculty election poll by ID
const getDepartmentPollById = async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await DepartmentPoll.findByPk(pollId, {
      include: [Department],
    });

    if (!poll) {
      return res
        .status(404)
        .json({ error: "Department election poll not found" });
    }

    res.status(200).json(poll);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch departmental election poll" });
  }
};

// Update a faculty election poll
const updateDepartmentPoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { title, startTime, endTime } = req.body;

    const poll = await DepartmentPoll.findByPk(pollId, {
      include: [Department],
    });

    if (!poll) {
      return res
        .status(404)
        .json({ error: "Department election poll not found" });
    }

    await poll.update({
      title,
      startTime,
      endTime,
    });

    res.status(200).json(poll);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update departmental election poll" });
  }
};

// Delete a faculty election poll
const deleteDepartmentPoll = async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await DepartmentPoll.findByPk(pollId);

    if (!poll) {
      return res
        .status(404)
        .json({ error: "Department election poll not found" });
    }

    await poll.destroy();

    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete department election poll" });
  }
};
module.exports = {
  createDepartmentPoll,
  getDepartmentPollById,
  updateDepartmentPoll,
  deleteDepartmentPoll,
};
