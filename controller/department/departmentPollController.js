const db = require("../../model");
//create main Model

const Department = db.department;
const DepartmentPoll = db.departmentalPoll;
const DepartmentalCandidate = db.departmentalCandidate;
const DepartmentVote = db.departmentvote;

// main work

// 1 create product

const createDepartmentPoll = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { title, startDate, endDate } = req.body;

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const poll = await DepartmentPoll.create({
      title: title,
      startDate: startDate,
      endDate: endDate,
      active: false, // Initially set the poll as inactive
    });

    await department.addDepartmentPoll(poll);

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: "Failed to create faculty election poll" });
  }
};

const getPollsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const polls = await DepartmentPoll.findAll({
      where: { department_id: departmentId },
    });

    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve polls" });
  }
};

const getDepartmetnCandidatesWithVotes = async (req, res) => {
  try {
    const { pollId } = req.params;

    const candidateVotes = await DepartmentVote.findAll({
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

    res.status(200).json(candidateVotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve candidate votes" });
  }
};

// Update a faculty election poll
const updateDepartmentPoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { title, startDate, endDate } = req.body;

    const poll = await DepartmentPoll.findByPk(pollId);

    if (!poll) {
      return res
        .status(404)
        .json({ error: "Departmental election poll not found" });
    }
    console.log(poll);

    await poll.update({
      title: title,
      startDate: startDate,
      endDate: endDate,
    });

    res.status(200).json({ message: "Poll updated successfully" });
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
  getPollsByDepartment,
  updateDepartmentPoll,
  deleteDepartmentPoll,
};
