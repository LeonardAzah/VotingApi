const db = require("../model");
const Student = db.student;

const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentLogin = async (req, res) => {
  const { matricule, password } = req.body;
  if (!matricule || !password)
    return res.status(400).json({ message: "Matricule and password required" });

  const foundUser = await Student.findOne({
    where: { matricule: matricule },
  });

  if (!foundUser) return res.sendStatus(401);
  const match = await bycrypt.compare(password, foundUser.password);

  if (match) {
    //create jwts

    const accessToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30min" }
    );

    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //save token with current user

    foundUser.refreshtoken = refreshToken;
    const result = await foundUser.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //security: true
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ name: `${foundUser.username}`, accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { studentLogin };
