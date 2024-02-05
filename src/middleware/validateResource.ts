import { NextFunction, Request, Response } from "express";
import { validationResult, ValidationError } from "express-validator";

const validate = (validations: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(
      validations.map((validation: any) => validation.run(req))
    );
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const response = errors.array().map((error: ValidationError) => {
      return {
        type: error.type,
        detail: error.msg,
        code: 400,
      };
    });
    res.status(400).json({ response: "errors", errors: response });
  };
};

export default validate;
