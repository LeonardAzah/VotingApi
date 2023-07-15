const { db } = require("../../model");
const NodeRSA = require("node-rsa");
//create main Model

const Student = db.student;
const Faculty = db.faculty;
const Department = db.department;
const FacultyPoll = db.facultyPoll;
const DepartmentalPoll = db.departmentalPoll;
const FacultyCandidate = db.facultyCandidate;
const DepartmentalCandidate = db.departmentalCandidate;
const Vote = db.vote;
const DepartmentVote = db.departmentvote;

// main work

//get all product
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

const getStudentsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findByPk(facultyId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const students = await faculty.getStudents();

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

const getStudentsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const students = await department.getStudents();

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

//get single product

const getOneStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) return res.status(400).json({ error: "Admin not found" });
    const student = await Student.findByPk(studentId);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
};

//update product

const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await student.update(req.body);

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to update student" });
  }
};

//delete product
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await student.destroy();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
};

const hasVoted = async (req, res) => {
  try {
    const { pollId, studentId } = req.params;

    const poll = await FacultyPoll.findByPk(pollId);

    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const hasVoted = await poll.hasStudent(student);

    res.status(200).json({ message: "Student has already cast a vote" });
  } catch (error) {
    res.status(500).json({ error: "Failed to check if student has voted" });
  }
};

const voteForCandidate = async (req, res) => {
  try {
    const { studentId, pollId, candidateId } = req.params;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const electionPoll = await FacultyPoll.findByPk(pollId);
    const departmentPoll = await DepartmentalPoll.findByPk(pollId);

    if (electionPoll) {
      const candidate = await FacultyCandidate.findByPk(candidateId);

      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }

      // Check if the poll is active (between the start and end time)
      const currentTime = new Date();
      const startTime = new Date(electionPoll.startDate);
      const endTime = new Date(electionPoll.endDate);

      if (currentTime < startTime || currentTime > endTime) {
        return res
          .status(400)
          .json({ error: "Voting is not active for this poll" });
      }

      // Check if the student has already voted in the same poll
      const hasVoted = await Vote.findOne({
        where: {
          pollId: pollId,
          studentId: studentId,
        },
      });

      if (hasVoted) {
        return res
          .status(400)
          .json({ error: "Student has already voted in this poll" });
      }

      // Retrieve the candidate's public key
      const publicKey = candidate.publicKey;

      // Create RSA key pair from the retrieved public key
      const key = new NodeRSA(publicKey, "pkcs8-public-pem");

      // Encrypt the vote using the candidate's public key
      const encryptedVote = key.encrypt(
        JSON.stringify({ pollId, candidateId }),
        "base64"
      );

      // Retrieve the candidate's private key
      const privateKey = candidate.privateKey;

      // Create RSA key pair from the retrieved private key
      const privateKeyObj = new NodeRSA(privateKey, "pkcs8-private-pem");

      // Create a digital signature for the encrypted vote
      const signature = privateKeyObj.sign(encryptedVote, "utf8", "base64");

      // Save the encrypted vote to the database
      const vote = await Vote.create({
        encryptedVote,
        signature,
        StudentId: studentId,
        PollId: pollId,
      });

      await vote.setFacultyPoll(electionPoll);
      await vote.setStudent(student);

      res.status(200).json({ message: "Vote cast successfully" });
    } else if (departmentPoll) {
      const departmentcandidate = await DepartmentalCandidate.findByPk(
        candidateId
      );

      if (!departmentcandidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }
      // Check if the poll is active (between the start and end time)
      const currentTime = new Date();
      const startTime = new Date(electionPoll.startDate);
      const endTime = new Date(electionPoll.endDate);

      if (currentTime < startTime || currentTime > endTime) {
        return res
          .status(400)
          .json({ error: "Voting is not active for this poll" });
      }

      // Check if the student has already voted in the same poll
      const hasVoted = await Vote.findOne({
        where: {
          pollId: pollId,
          studentId: studentId,
        },
      });

      if (hasVoted) {
        return res
          .status(400)
          .json({ error: "Student has already voted in this poll" });
      }

      // Retrieve the candidate's public key
      const publicKey = departmentcandidate.publicKey;

      // Create RSA key pair from the retrieved public key
      const key = new NodeRSA(publicKey, "pkcs8-public-pem");

      // Encrypt the vote using the candidate's public key
      const encryptedVote = key.encrypt(
        JSON.stringify({ pollId, candidateId }),
        "base64"
      );

      // Retrieve the candidate's private key
      const privateKey = departmentcandidate.privateKey;

      // Create RSA key pair from the retrieved private key
      const privateKeyObj = new NodeRSA(privateKey, "pkcs8-private-pem");

      // Create a digital signature for the encrypted vote
      const signature = privateKeyObj.sign(encryptedVote, "utf8", "base64");

      // Save the encrypted vote to the database
      const vote = await Vote.create({
        encryptedVote,
        signature,
        StudentId: studentId,
        PollId: pollId,
      });

      await vote.setDepartmentalPoll(departmentPoll);
      await vote.setStudent(student);

      res.status(200).json({ message: "Vote cast successfully" });
    } else {
      return res.status(404).json({ error: "Election poll not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to cast vote" });
  }
};

module.exports = {
  getAllStudents,
  getOneStudent,
  getStudentsByDepartment,
  getStudentsByFaculty,
  updateStudent,
  deleteStudent,
  voteForCandidate,
};
