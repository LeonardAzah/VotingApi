const db = require("../model");
//create main Model

const Faculty = db.faculty;
const Department = db.department;
const Poll = db.poll;

// main work

// 1 create product

const createPoll = async (req, res) => {
  const { title, electionType, startDate, endDate } = req.body;
  if (!title || !electionType || !startDate || !endDate)
    return res.status(400).json({ message: "All fields require required" });

  const duplicate = await Poll.findOne({ where: { title: title } });

  if (duplicate) {
    return res.status(409).json({ message: "Faculty already exist" });
  } else {
    try {
      const result = await Faculty.create({
        title: title,
        electionType: electionType,
        startDate: startDate,
        endDate: endDate,
      });
      res.status(201).json({ result });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

//get all product
const getAllPolls = async (req, res) => {
  const poll = await Poll.findAll({
    attributes: ["title", "electionType", "startDate", "endDate"],
  });
  res.status(200).send(poll);
};

//get single product

const getOnePoll = async (req, res) => {
  let Id = req.params.id;
  if (!Id) return res.status(400);
  const poll = await Poll.findOne({ where: { id: Id } });
  res.status(200).send(poll);
};

//update product

const updatePoll = async (req, res) => {
  let Id = req.params.id;
  const poll = await Poll.update(req.body, { where: { id: Id } });
  res.status(200).send(poll);
};

//delete product
const deletePoll = async (req, res) => {
  let Id = req.params.id;

  try {
    // Check if poll exists
    const poll = await Poll.findOne({ where: { id: Id } });
    if (!poll) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    // Delete the poll
    const result = await Poll.destroy({ where: { id: Id } });
    res.json({ success: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createPoll,
  getAllPolls,
  getOnePoll,
  updatePoll,
  deletePoll,
};
