const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  const token = req.header("x-access-token"); // Get the token from the header
  if (!token) {
    return res.status(401).send("Access denied. No token provided."); // Return an error if no token is provided
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify the token with your secret key
    req.user = decoded.username; // Set the decoded payload as a property of the request object
  } catch (ex) {
    res.status(400).send("Invalid token."); // Return an error if the token is invalid
  }
};

module.exports = verifyJWT;
