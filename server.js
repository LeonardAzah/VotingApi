require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const connectDb = require("./config/dbConn");
const verifyJWT = require("./middleware/verifyjwt");

const app = express();

//port
const PORT = process.env.PORT || 3500;

var corOptions = {
  origin: "https://localhost:8081",
};

//middleware
app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routers
// app.use("/signup", require("./route/signupStd"));
// app.use("/signin", require("./route/signinStd"));
app.use("/faculties", require("./route/api/faculty"));
app.use("/", require("./route/api/department"));

// app.use(verifyJWT);

//server
app.listen(PORT, () => {
  console.log(`server is runningon port ${PORT}`);
});
