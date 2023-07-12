const { db } = require("../../model");
const multer = require("multer");
const fs = require("fs");

//create main Model

const FacultyCandidate = db.facultyCandidate;
const Student = db.student;
const FacultyPoll = db.facultyPoll;
const Department = db.department;
const Faculty = db.faculty;
const DepartmetnPoll = db.departmentalPoll;
const DepartmentCandidate = db.departmentalCandidate;

// main work

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

// 1 create product

const createFacultyCandidate = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        // Handle Multer error
        return res.status(500).json({ error: "Failed to upload image" });
      }
      const { pollId } = req.params;
      const { name, matricule, bio } = req.body;

      const { filename } = req.file;

      // Check if the student exists based on the matricule
      const student = await Student.findOne({ where: { matricule } });

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const facultypoll = await FacultyPoll.findByPk(pollId);
      const departmentPoll = await DepartmetnPoll.findByPk(pollId);

      if (facultypoll) {
        const duplicate = await FacultyCandidate.findOne({
          where: { faculty_poll_id: pollId, matricule: matricule },
        });
        if (duplicate) {
          return res.status(409).json({ error: "Candidate already exist" });
        }

        const candidate = await FacultyCandidate.create({
          name,
          matricule,
          bio,
          image: filename,
        });

        await candidate.setStudent(student);
        await candidate.setFacultyPoll(facultypoll);

        res.status(201).json(candidate);
      } else if (departmentPoll) {
        const duplicate = await DepartmentCandidate.findOne({
          where: { departmental_poll_id: pollId, matricule: matricule },
        });
        if (duplicate) {
          return res
            .status(409)
            .json({ error: "Candidate poll already exist" });
        }

        const candidate = await DepartmentCandidate.create({
          name,
          bio,
          matricule,
          image: filename,
        });

        await candidate.setStudent(student);
        await candidate.setDepartmentalPoll(departmentPoll);

        res.status(201).json(candidate);
      } else {
        return res.status(404).json({ error: "Election poll not found" });
      }
    });
  } catch (error) {
    // res.status(500).json({ error: "Failed to create candidate" });
    console.log(error);
  }
};

// Get a candidate by student's matricule
const getFacultyCandidateByMatricule = async (req, res) => {
  try {
    const { Id } = req.params;

    const fCandidate = await FacultyCandidate.findOne({ where: { id: Id } });
    const dCandidate = await DepartmentCandidate.findOne({
      where: { id: Id },
    });

    if (fCandidate) {
      res.status(200).json(fCandidate);
    } else if (dCandidate) {
      res.status(200).json(dCandidate);
    } else {
      return res.status(404).json({ error: "Candidate not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidate" });
  }
};

const getAllFacultyCandidates = async (req, res) => {
  try {
    const candidates = await FacultyCandidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

const getFacultyCandidatesByPollId = async (req, res) => {
  try {
    const { pollId } = req.params;

    const electionPoll = await FacultyPoll.findByPk(pollId);

    if (!electionPoll) {
      return res.status(404).json({ error: "Election poll not found" });
    }

    const candidates = await FacultyCandidate.findAll({
      where: { faculty_poll_id: pollId },
    });

    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

// Update a candidate by student's matricule
const updateFacultyCandidateByMatricule = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        // Handle Multer error
        return res.status(500).json({ error: "Failed to upload image" });
      }

      const { Id } = req.params;
      const { name, bio } = req.body;
      const { filename } = req.file;
      console.log(name, bio);
      console.log(filename);

      const fCandidate = await FacultyCandidate.findOne({ where: { id: Id } });
      const dCandidate = await DepartmentCandidate.findOne({
        where: { id: Id },
      });

      if (fCandidate) {
        await fCandidate.update({ name, bio, image: filename });
        res.status(200).json({ message: "Candidate updated successfully" });
      } else if (dCandidate) {
        await dCandidate.update({ name, bio, image: filename });
        res.status(200).json({ message: "Candidate updated successfully" });
      } else {
        return res.status(404).json({ error: "Candidate not found" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete candidate" });
  }
};

// Delete a candidate by student's matricule
const deleteCandidateByMatricule = async (req, res) => {
  try {
    const { Id } = req.params;

    const fCandidate = await FacultyCandidate.findOne({ where: { id: Id } });
    const dCandidate = await DepartmentCandidate.findOne({
      where: { id: Id },
    });

    if (fCandidate) {
      // Delete the image file from the server if it exists

      await fCandidate.destroy();

      res.status(200).json({ message: "Candidate deleted successfully" });
    } else if (dCandidate) {
      await dCandidate.destroy();

      res.status(200).json({ message: "Candidate deleted successfully" });
    } else {
      return res.status(404).json({ error: "Candidate not found" });
    }
  } catch (error) {
    // res.status(500).json({ error: "Failed to delete candidate" });
    res.status(500).json(error);
  }
};

module.exports = {
  createFacultyCandidate,
  getFacultyCandidateByMatricule,
  getAllFacultyCandidates,
  getFacultyCandidatesByPollId,
  updateFacultyCandidateByMatricule,
  deleteCandidateByMatricule,
};
