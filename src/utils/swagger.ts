import { Express, Request, Response } from "express";
import swaggerJdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logger from "./logger";
import { version } from "../../package.json";

const options: swaggerJdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vote me REST API Docs",
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/schema/*.ts"],
};

const swaggerSpec = swaggerJdoc(options);

function swaggerDocs(app: Express, port: number) {
  //swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  //Docs in JSON format

  app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
