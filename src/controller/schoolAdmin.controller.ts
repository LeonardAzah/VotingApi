import { Request, Response } from "express";
import { createStudent, findUser } from "../service/userService";
import asyncHandler from "../utils/handleAsync";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import sendVerificationEmail from "../utils/sendVerificationEmail";
import { getDepartmentById } from "../service/departmentService";

export const createStudentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      email,
      image,
      password,
      matricule,
      dateOfBirth,
      sex,
      departmentId,
    } = req.body;

    const emailAlreadyExists = await findUser(email);
    const department = await getDepartmentById(departmentId);

    if (emailAlreadyExists) {
      throw new BadRequestError("Email already exists");
    }

    if (!department) {
      throw new NotFoundError("Department not found");
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);

    const student = await createStudent({
      name,
      email,
      image,
      password: passwordHash,
      matricule,
      dateOfBirth,
      sex,
      departmentId,
      otp,
    });

    await sendVerificationEmail({
      name: student.name,
      email: student.email,
      otp: student.otp,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ response: "successfull", data: { student } });
  }
);
