import { Request, Response } from "express";
import asyncHandler from "../utils/handleAsync";
import { StatusCodes } from "http-status-codes";
import { findUser, updateUser } from "../service/user.service";
import { BadRequestError, NotFoundError } from "../errors";
import { findCandidateById } from "../service/candidate.service";
import { getElectionById } from "../service/electio .service";
StatusCodes;
import otpGenerator from "otp-generator";
import createHash from "../utils/createHash";
import sendVoteRequestEmail from "../utils/sendVoteRequestMail";
import { getDepartmentById } from "../service/department.service";
import { getFacultyById } from "../service/faculty.service";

export const voteRequest = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.body;

  const userId = req.body.user.id;
  const candidateId = req.params.id;

  const student = await findUser(userId);

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  const candidate = await findCandidateById(candidateId);

  if (!candidate) {
    throw new NotFoundError("Candidate not found");
  }

  const election = await getElectionById(electionId);
  if (!election) {
    throw new NotFoundError("Election not found");
  }

  const checkStudent = await checkEligibility(userId, candidateId);

  if (checkStudent === false) {
    throw new BadRequestError("Not eligible!");
  }

  const otp: string = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const hashOTP = await createHash(otp);

  const updates = {
    voteOtp: hashOTP,
  };
  await updateUser(userId, updates);
  await sendVoteRequestEmail({
    name: student.name,
    email: student.email,
    election: election.title,
    otp,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ response: "successfull", message: "OTP send!" });
});

export const castVoteHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { electionId } = req.body;

    const userId = req.body.user.id;
    const candidateId = req.params.id;

    const user = findUser(userId);
    if (!user) {
      throw new NotFoundError("Student not found");
    }
    const candidate = findCandidateById(candidateId);

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    const election = getElectionById(electionId);
    if (!election) {
      throw new NotFoundError("Election not found");
    }
  }
);

const checkEligibility = async (
  userId: string,
  electionId: string
): Promise<boolean> => {
  const student = await findUser(userId);

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  const department = await getDepartmentById(student.departmentId);

  const election = await getElectionById(electionId);
  if (!election) {
    throw new NotFoundError("Election not found");
  }

  if (election.type === "FACULTY") {
    if (department?.faculty.id !== election.facultyId) {
      return false;
    }
  }

  if (election.type === "DEPARTMENT") {
    if (student.departmentId !== election.departmentId) {
      return false;
    }
  }

  return true;
};
