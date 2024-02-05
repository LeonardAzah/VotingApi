import { body } from "express-validator";
export const createStudentValidator = [
  body("name", "Name is required").not().isEmpty(),
  body("email", "Invalid email").isEmail(),
  body("dateOfBirth", "Invalid birthday").isISO8601(), // check date is ISOString
  body("password", "password is required").not().isEmpty(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
  body("image", "Image is required").not().isEmpty(),
  body("matricule", "Image is required").not().isEmpty(),
  body("sex", "Sex is required").not().isEmpty(),
  body("departmentId", "Department id is required").not().isEmpty(),
];
