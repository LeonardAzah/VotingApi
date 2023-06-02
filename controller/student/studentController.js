const db = require("../model");
//create main Model

const Student = db.student;
const Faculty = db.faculty;
const Department = db.department;
const FacultyPoll = db.facultyPoll;
const DepartmentalPoll = db.DepartmentalPoll;
const FacultyCandidate = db.facultyCandidate;
const DepartmentalCandidate = db.departmentalCandidate;

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

const castFacultyVote = async (req, res) => {
  try {
    const { studentId, pollId, candidateId } = req.params;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const electionPoll = await FacultyPoll.findByPk(pollId);

    if (!electionPoll) {
      return res.status(404).json({ error: "Faculty election poll not found" });
    }

    const candidate = await FacultyCandidate.findByPk(candidateId);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Check if the poll is active (between the start and end time)
    const currentTime = new Date();
    const startTime = new Date(electionPoll.startTime);
    const endTime = new Date(electionPoll.endTime);

    if (currentTime < startTime || currentTime > endTime) {
      return res
        .status(400)
        .json({ error: "Voting is not active for this poll" });
    }

    // Check if the student has already voted in the same poll
    const hasVoted = await student.hasVotedIn(electionPoll);

    if (hasVoted) {
      return res
        .status(400)
        .json({ error: "Student has already voted in this poll" });
    }

    // Cast the vote by associating the candidate with the student
    await student.addVote(FacultyCandidate, { through: { PollId: pollId } });

    res.status(200).json({ message: "Vote cast successfully" });
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
  castFacultyVote,
};
