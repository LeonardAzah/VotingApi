const { db, sequelize } = require("../../model");
const { Sequelize, DataTypes, fn } = require("sequelize");
const multer = require("multer");
const fs = require("fs");
const NodeRSA = require("node-rsa");

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
const Student = db.student;
const DepartmentCandidate = db.departmentalCandidate;

// main work

// 1 create product

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Create Multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB in bytes
  },
});

const createFacultyPoll = async (req, res) => {
  try {
    const { Id } = req.params;
    const { title, startDate, endDate } = req.body;

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

    const facultyPolls = polls.map((poll) => {
      return {
        ...poll.toJSON(),
        isActive: isPollActive(poll.startDate, poll.endDate),
      };
    });

    const dpolls = await DepartmentalPoll.findAll({
      where: { department_id: departmentId },
    });

    const departmentpolls = dpolls.map((poll) => {
      return {
        ...poll.toJSON(),
        isActive: isPollActive(poll.startDate, poll.endDate),
      };
    });

    res.status(200).json({ facultyPolls, departmentpolls });
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
      const candidates = await FacultyCandidate.findAll({
        where: { faculty_poll_id: pollId },
        attributes: ["id", "name", "image", "publicKey", "privateKey"],
      });

      // Retrieve all votes for the poll
      const votes = await Vote.findAll({ where: { PollId: pollId } });

      // Count the votes for each candidate
      const voteCounts = {};

      candidates.forEach((candidate) => {
        voteCounts[candidate.id] = {
          candidateId: candidate.id,
          count: 0,
          name: candidate.name,
          image: candidate.image,
        };
      });

      // Verify the signature and decrypt the votes
      votes.forEach((vote) => {
        const encryptedVote = vote.encryptedVote;
        const signature = vote.signature;
        candidates.forEach((candidate) => {
          const { id, publicKey, privateKey } = candidate;

          try {
            // Create RSA key pair from the candidate's public key and private key
            const publicKeyObj = new NodeRSA(publicKey, "pkcs8-public-pem");
            const privateKeyObj = new NodeRSA(privateKey, "pkcs8-private-pem");

            // Verify the digital signature
            const isSignatureValid = publicKeyObj.verify(
              encryptedVote,
              signature,
              "utf8",
              "base64"
            );
            console.log(isSignatureValid);

            // Decrypt the vote using the candidate's private key
            let decryptedVote;
            try {
              decryptedVote = privateKeyObj.decrypt(encryptedVote, "utf8");
            } catch (error) {
              return;
            }

            const { pollId, candidateId } = JSON.parse(decryptedVote);

            if (pollId === pollId) {
              voteCounts[candidateId].count++;
            }
          } catch (error) {
            console.error(`Error for candidate with ID ${id}:`, error);
          }
        });
      });

      const candidateVotes = Object.values(voteCounts);

      res.status(200).json({ candidateVotes });
    } else if (deptpoll) {
      const candidates = await DepartmentalCandidate.findAll({
        where: { departmental_poll_id: pollId },
        attributes: ["id", "name", "image", "publicKey", "privateKey"],
      });

      // Retrieve all votes for the poll
      const votes = await Vote.findAll({ where: { PollId: pollId } });

      // Count the votes for each candidate
      const voteCounts = {};

      candidates.forEach((candidate) => {
        voteCounts[candidate.id] = {
          candidateId: candidate.id,
          count: 0,
          name: candidate.name,
          image: candidate.image,
        };
      });

      // Verify the signature and decrypt the votes
      votes.forEach((vote) => {
        const encryptedVote = vote.encryptedVote;
        const signature = vote.signature;
        candidates.forEach((candidate) => {
          const { id, publicKey, privateKey } = candidate;

          try {
            // Create RSA key pair from the candidate's public key and private key
            const publicKeyObj = new NodeRSA(publicKey, "pkcs8-public-pem");
            const privateKeyObj = new NodeRSA(privateKey, "pkcs8-private-pem");

            // Verify the digital signature
            const isSignatureValid = publicKeyObj.verify(
              encryptedVote,
              signature,
              "utf8",
              "base64"
            );
            console.log(isSignatureValid);

            // Decrypt the vote using the candidate's private key
            let decryptedVote;
            try {
              decryptedVote = privateKeyObj.decrypt(encryptedVote, "utf8");
            } catch (error) {
              return;
            }

            const { pollId, candidateId } = JSON.parse(decryptedVote);

            if (pollId === pollId) {
              voteCounts[candidateId].count++;
            }
          } catch (error) {
            console.error(`Error for candidate with ID ${id}:`, error);
          }
        });
      });

      const candidateVotes = Object.values(voteCounts);

      res.status(200).json({ candidateVotes });
    } else {
      return res.status(404).json({ error: "Poll not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve candidate votes" });
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
    res.status(500).json({ error: "Failed to retrieve candidates" });
  }
};

const getPollById = async (req, res) => {
  try {
    const { Id } = req.params;

    const fPoll = await FacultyPoll.findOne({ where: { id: Id } });
    const dPoll = await DepartmentPoll.findOne({
      where: { id: Id },
    });

    if (fPoll) {
      res.status(200).json(fPoll);
    } else if (dPoll) {
      res.status(200).json(dPoll);
    } else {
      return res.status(404).json({ error: "Election not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidate" });
  }
};

// Update a faculty election poll
const updateFacultyPoll = async (req, res) => {
  try {
    const { Id } = req.params;
    const { title, startDate, endDate } = req.body;

    const fPoll = await FacultyPoll.findOne({ where: { id: Id } });
    const dPoll = await DepartmentPoll.findOne({
      where: { id: Id },
    });

    if (fPoll) {
      await fPoll.update({
        title: title,
        startDate: startDate,
        endDate: endDate,
      });

      res.status(200).json(fPoll);
    } else if (dPoll) {
      await dPoll.update({
        title: title,
        startDate: startDate,
        endDate: endDate,
      });
      res.status(200).json(dPoll);
    } else {
      return res.status(404).json({ error: "Election not found" });
    }
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

const isPollActive = (startDate, endDate) => {
  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return currentDate >= start && currentDate <= end;
};

module.exports = {
  createFacultyPoll,
  getPollsByFaculty,
  getFacultyCandidatesWithVotes,
  getCandidatesByPoll,
  getPollById,
  updateFacultyPoll,
  deleteFacultyPoll,
};
