import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
// const errorHandlerMiddleware = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let customError = {
//     // set default
//     statusCode: statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
//     msg: err.message || "Something went wrong try again later",
//   };

//   if (err.name === "ValidationError") {
//     customError.msg = err.message;
//     customError.statusCode = StatusCodes.BAD_REQUEST;
//   }

//   if (err.name === "CastError") {
//     customError.msg = "No item found";
//     customError.statusCode = 404;
//   }

//   return res.status(customError.statusCode).json({ msg: customError.msg });
// };

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
