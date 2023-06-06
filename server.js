require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyjwt");

const swaggerUi = require("swagger-ui-express");
const specs = require("./config/Swagger");

const app = express();

//port
const PORT = process.env.PORT || 3500;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

var corOptions = {
  origin: "https://localhost:3000",
};

//middleware
app.use(cors(corOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routers
app.use("/signup", require("./route/signupStd"));
app.use("/adminSignup", require("./route/adminsignup"));
app.use("/faculties", require("./route/api/faculty"));
app.use("/dept", require("./route/api/department"));
app.use("/std", require("./route/api/student"));
app.use("/admin", require("./route/api/admin"));
app.use("/candidate", require("./route/api/candidate"));
app.use("/poll", require("./route/api/poll"));

// app.use(verifyJWT);

//server
app.listen(PORT, () => {
  console.log(`server is runningon port ${PORT}`);
});
