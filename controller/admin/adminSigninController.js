const { db } = require("../../model");
const Admin = db.admin;

const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const foundUser = await Admin.findOne({
      where: { email: email },
    });

    if (!foundUser)
      return res.status(500).json({ error: "Invalid email and password" });
    const match = await bycrypt.compare(password, foundUser.password);

    if (match) {
      //create jwts

      const accessToken = jwt.sign(
        {
          username: foundUser.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        {
          username: foundUser.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "12h" }
      );

      //save token with current user

      foundUser.refreshtoken = refreshToken;
      const result = await foundUser.save();
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        //security: true
        maxAge: 12 * 60 * 60 * 1000,
      });
      res.json({
        name: `${foundUser.username}`,
        faculty: `${foundUser.faculty_id}`,
        department: `${foundUser.department_id}`,
        accessToken,
      });
    } else {
      res.status(500).json({ error: "Invalid email and password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Invalid email and password" });
  }
};

module.exports = { adminLogin };
