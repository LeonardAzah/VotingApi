require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");

const app = express();

//port
const PORT = process.env.PORT || 3500;

var corOptions = {
  origin: "https://localhost:3000",
};

//middleware
app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use(express.static("images"));

app.use(express.urlencoded({ extended: true }));

//routers

app.use("/signup", require("./route/signupStd"));
app.use("/signin", require("./route/signinStd"));

app.use("/adminSignin", require("./route/adminSign"));
app.use("/adminSignup", require("./route/adminsignup"));

// app.use(verifyJWT);
app.use("/refresh", require("./route/refresh"));

app.use("/faculties", require("./route/api/faculty"));
app.use("/dept", require("./route/api/department"));
app.use("/std", require("./route/api/student"));
app.use("/admin", require("./route/api/admin"));
app.use("/candidate", require("./route/api/candidate"));
app.use("/poll", require("./route/api/poll"));
app.use("/logout", require("./route/logout"));

//server
app.listen(PORT, () => {
  console.log(`server is runningon port ${PORT}`);
});
