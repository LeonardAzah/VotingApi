require("dotenv").config();
const db = require("../model");
const Admin = db.admin;
const Student = db.student;

const userLogout = async (req, res) => {
  try {
    const cookies = req.cookie;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    console.log(refreshToken);

    const foundUser = await Admin.findOne({
      where: { refreshtoken: refreshToken },
    });

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        //secure: true
      });
      return res.sendStatus(204);
    }

    //delet refresh token in db
    foundUser.refreshtoken = "";
    const result = await foundUser.save();
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      //secure:true
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const userStudent = async (req, res) => {
  try {
    const cookies = req.cookie;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundUser = await Student.findOne({
      where: { refreshtoken: refreshToken },
    });

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        //secure: true
      });
      return res.sendStatus(204);
    }

    //delet refresh token in db
    foundUser.refreshtoken = "";
    const result = await foundUser.save();
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      //secure:true
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { userLogout, userStudent };
