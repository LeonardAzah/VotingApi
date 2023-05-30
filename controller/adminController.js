const db = require("../model");
//create main Model

const Admin = db.admin;

// main work

//get all product
const getAllAdmins = async (req, res) => {
  const result = await Admin.findAll({
    attributes: ["username", "faculty", "department"],
  });
  res.status(200).send(result);
};

//get single product

const getOneAdmin = async (req, res) => {
  let Id = req.params.id;
  if (!Id) return res.status(400);
  const result = await Admin.findOne({ where: { id: Id } });
  res.status(200).send(result);
};

//update product

const updateAdmin = async (req, res) => {
  let Id = req.params.id;
  const result = await Admin.update(req.body, { where: { id: Id } });
  res.status(200).send(result);
};

//delete product
const deleteAdmin = async (req, res) => {
  let Id = req.params.id;

  try {
    // Check if faculty exists
    const admin = await Admin.findOne({ where: { id: Id } });
    if (!faculty) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Delete the faculty
    const result = await Admin.destroy({ where: { id: Id } });
    res.json({ success: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllAdmins,
  getOneAdmin,
  updateAdmin,
  deleteAdmin,
};
