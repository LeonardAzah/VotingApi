const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "voting_api",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: "http://localhost:3500", // replace with your server URL
      },
    ],
  },
  apis: ["../routes/*.js"], // specify the path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
