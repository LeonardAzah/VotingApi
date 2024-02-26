import express from "express";
import dotenv from "dotenv";

import logger from "./utils/logger";
import errorHandlerMiddleware from "./middleware/error-handler";
import notFound from "./middleware/not-found";
import swaggerDocs from "./utils/swagger";
import * as swaggerDocument from "./swagger.json";
import cookieParser from "cookie-parser";

import facultyRoutes from "./routes/faculty.routes";
import departmentRoutes from "./routes/department.routes";
import studentRoutes from "./routes/student.routes";
import authRoutes from "./routes/auth.routes";
import administratorRoutes from "./routes/administrator.routes";
import electionRoutes from "./routes/election.routes";
import candidateRoutes from "./routes/candidate.routes";
import voteRoutes from "./routes/vote.routes";

dotenv.config();
const app = express();
const port: number = Number(process.env.PORT) || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/faculties", facultyRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admins", administratorRoutes);
app.use("api/v1/election", electionRoutes);
app.use("/api/v1/candidates", candidateRoutes);
app.use("/api/v1/votes", voteRoutes);

app.get("/", (req, res) => {
  res.send("School voting system");
});

swaggerDocs(app, port);

app.use(notFound);
app.use(errorHandlerMiddleware);
app.listen(port, () => {
  logger.info("The application is listening on port 5000!");
});
