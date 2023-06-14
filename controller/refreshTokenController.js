require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../model");
const Admin = db.admin;
const Student = db.student;

const userRefreshToken = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) return res.sendStatus(401);

  const refreshToken = cookie.jwt;

  const foundUser = await Admin.findOne({
    where: { refreshtoken: refreshToken },
  });

  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
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

    res.json({ accessToken });
  });
};
const userRefreshTokenstd = async (req, res) => {
  const cookie = req.cookie;

  if (!cookie?.jwt) return res.sendStatus(401);

  const refreshToken = cookie.jwt;

  const foundUser = await Student.findOne({
    where: { refreshtoken: refreshToken },
  });

  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username != decoded.username)
      return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        username: username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30min" }
    );

    res.json({ accessToken });
  });
};

module.exports = { userRefreshToken, userRefreshTokenstd };
