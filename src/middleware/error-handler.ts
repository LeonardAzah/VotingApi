import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const errorHandlerMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError: boolean =
    error.constructor.name === "NodeError" ||
    error.constructor.name === "SyntaxError"
      ? false
      : true;
  logger.error({
    StatusCode: error.statusCode,
    ErrorMessage: error.message,
    ErrorName: error.type,
  });
  res.status(error.statusCode || 500).json({
    response: "Error",
    error: {
      type: customError === false ? "UnhandledError" : error.constructor.name,
      path: req.path,
      statusCode: error.statusCode || 500,
      message: error.message,
    },
  });
};

export default errorHandlerMiddleware;
