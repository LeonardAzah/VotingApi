require("dotenv").config();
const jwt = require("jsonwebtoken");
const { db } = require("../model");
const Admin = db.admin;
const Student = db.student;

const userRefreshToken = async (req, res) => {
  try {
    const cookie = req.cookies;

    if (!cookie?.jwt) return res.sendStatus(401);

    const refreshToken = cookie.jwt;

    const foundUser = await Admin.findOne({
      where: { refreshtoken: refreshToken },
    });

    if (!foundUser) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username != decoded.username)
          return res.sendStatus(403);

        const username = foundUser.username;

        const accessToken = jwt.sign(
          {
            username: username,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30min" }
        );

        res.json({
          name: `${foundUser.username}`,
          id: `${foundUser.id}`,
          faculty: `${foundUser.faculty_id}`,
          department: `${foundUser.department_id}`,
          accessToken,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Unale to refresh access token" });
  }
};

const userRefreshTokenstd = async (req, res) => {
  try {
    const cookie = req.cookies;

    if (!cookie?.jwt) return res.sendStatus(401);

    const refreshToken = cookie.jwt;

    const foundUser = await Student.findOne({
      where: { refreshtoken: refreshToken },
    });

    if (!foundUser) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username != decoded.username)
          return res.sendStatus(403);

        const username = foundUser.username;

        const accessToken = jwt.sign(
          {
            username: username,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30min" }
        );

        res.json({
          name: `${foundUser.username}`,
          id: `${foundUser.id}`,
          faculty: `${foundUser.faculty_id}`,
          department: `${foundUser.department_id}`,
          accessToken,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Unale to refresh access token" });
  }
};

module.exports = { userRefreshToken, userRefreshTokenstd };
