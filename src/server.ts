import express from "express";
import dotenv from "dotenv";

import facultyRoutes from "./routes/facultyRoutes";
import departmentRoutes from "./routes/departmentRoutes";
import logger from "./utils/logger";
import errorHandlerMiddleware from "./middleware/error-handler";
import notFound from "./middleware/not-found";
import swaggerDocs from "./utils/swagger";

dotenv.config();
const app = express();
const port: number = Number(process.env.PORT) || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/faculties", facultyRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.get("/", (req, res) => {
  res.send("School voting system");
});
swaggerDocs(app, port);

app.use(notFound);
app.use(errorHandlerMiddleware);
app.listen(port, () => {
  logger.info("The application is listening on port 5000!");
});
