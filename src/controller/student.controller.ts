import { Request, Response } from "express";
import { createStudent, findUser } from "../service/user.service";
import asyncHandler from "../utils/handleAsync";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import sendVerificationEmail from "../utils/sendVerificationEmail";
import { getDepartmentById } from "../service/department.service";
import { IStudent } from "../interface/student.interface";

export const createStudentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data: IStudent = req.body;

    const emailAlreadyExists = await findUser(data.email);
    const department = await getDepartmentById(data.departmentId);

    if (emailAlreadyExists) {
      throw new BadRequestError("Email already exists");
    }

    if (!department) {
      throw new NotFoundError("Department not found");
    }

    const otp: string = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const salt = await bcrypt.genSalt(10);

    data.password = await bcrypt.hash(data.password, salt);

    const student = await createStudent(data);

    await sendVerificationEmail({
      name: student.name,
      email: student.email,
      otp: otp,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ response: "successfull", data: { student } });
  }
);
