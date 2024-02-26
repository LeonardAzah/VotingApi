import { Request, Response } from "express";
import NodeRSA from "node-rsa";
import bcrypt from "bcryptjs";

import asyncHandler from "../utils/handleAsync";
import { StatusCodes } from "http-status-codes";
import { findUser, updateUser } from "../service/user.service";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";
import {
  findCandidateById,
  findCandidatesByElection,
} from "../service/candidate.service";
import { getElectionById } from "../service/electio .service";
StatusCodes;
import otpGenerator from "otp-generator";
import createHash from "../utils/createHash";
import sendVoteRequestEmail from "../utils/sendVoteRequestMail";
import { getDepartmentById } from "../service/department.service";
import { getFacultyById } from "../service/faculty.service";
import { castElection, getVotes, hasvoted } from "../service/vote.service";
import isElectionActive from "../utils/isElectionActive";

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

  await isElectionActive(election);

  const checkStudent = await checkEligibility(userId, candidateId);

  if (checkStudent === false) {
    throw new BadRequestError("Not eligible!");
  }

  const studentExist = await hasvoted(student.id, election.id);
  if (!studentExist) {
    throw new BadRequestError("Already Voted!");
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
    .status(StatusCodes.OK)
    .json({ response: "successfull", message: "OTP send!" });
});

export const castVoteHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { voteOtp, electionId } = req.body;

    const userId: string = req.body.user.id;
    const candidateId = req.params.id;
    const key = new NodeRSA({ b: 512 });

    const user = await findUser(userId);
    if (!user) {
      throw new NotFoundError("Student not found");
    }
    if (!user.voteOtp) {
      throw new NotFoundError("Student not found");
    }

    const checkVoteOtp = await bcrypt.compare(voteOtp, user.voteOtp);
    if (!checkVoteOtp) {
      throw new UnauthorizedError("Invalid Credentials");
    }
    const candidate = await findCandidateById(candidateId);

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }
    if (!candidate.publickey) {
      throw new NotFoundError("Candidate not found");
    }

    const election = await getElectionById(electionId);
    if (!election) {
      throw new NotFoundError("Election not found");
    }

    const publickey = key.decrypt(candidate.publickey, "utf8");
    const voteData = {
      electionId: election.id,
      studentId: userId,
      candidateId: candidate.id,
    };

    const encryptedVote: string = new NodeRSA(publickey).encrypt(
      voteData,
      "base64"
    );
    const data = {
      electionId: election.id,
      studentId: userId,
      encryptedVote,
    };

    await castElection(data);

    const updates = {
      voteOtp: "",
    };
    await updateUser(userId, updates);

    res
      .status(StatusCodes.CREATED)
      .json({ response: "successfull", message: "Vote cast!" });
  }
);

export const getResult = asyncHandler(async (req: Request, res: Response) => {
  const electionId = req.params.id;
  const election = await getElectionById(electionId);

  if (!election) {
    throw new NotFoundError("Election not found");
  }

  const candidates = await findCandidatesByElection(election.id);

  const results = await getVotes(electionId);

candidates.forEach(candidate => {
    const decryptedData = new NodeRSA(candidate.privatekey).decrypt(, 'utf8');
    // Count votes based on decrypted data
});

});

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
