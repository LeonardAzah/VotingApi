import { Request, Response } from "express";
import {
  addCandidate,
  approveCandidate,
  deleteCandidate,
  findAllCandidates,
  findCandidateById,
  findCandidatesByElection,
  updateCandidate,
} from "../service/candidate.service";
import asyncHandler from "../utils/handleAsync";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors";
import { getElectionById } from "../service/electio .service";
import sendCandidateMail from "../utils/sendCandidateMail";
import { findUser } from "../service/user.service";
import NodeRSA from "node-rsa";

export const createCandidateHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const candidate = await addCandidate(data);
    res
      .status(StatusCodes.CREATED)
      .json({ response: "successfull", data: { candidate } });
  }
);

export const getCandidateHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const candidates = await findAllCandidates();
    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { candidates } });
  }
);

export const getCandidateByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const candidate = await findCandidateById(id);
    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { candidate } });
  }
);

export const getCandidatesByElectionHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const electionId = req.params.id;
    const election = await getElectionById(electionId);
    if (!election) {
      throw new NotFoundError("Election not found");
    }
    const candidates = await findCandidatesByElection(electionId);

    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { candidates } });
  }
);

export const updateCandidateHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    const candidateExist = await findCandidateById(id);
    if (!candidateExist) {
      throw new NotFoundError("Candidate not found");
    }

    const candidate = await updateCandidate(id, data);
    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { candidate } });
  }
);

export const deleteCandidateHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const candidate = await findCandidateById(id);
    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    await deleteCandidate(id);
    res.status(200).json({ message: "Candidate deleted successfully" });
  }
);

export const approveCandidateHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const candidate = await findCandidateById(id);
    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    const user = await findUser(candidate.matricule);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const election = await getElectionById(candidate.electionId);
    if (!election) {
      throw new NotFoundError("Election not found");
    }
    const key = new NodeRSA({ b: 512 });
    const PUBLICKEY_HEADER = "-----BEGIN PUBLIC KEY-----";
    const PUBLICKEY_FOOTER = "-----END PUBLIC KEY-----";

    const publicKey = key
      .exportKey("pkcs8-public")
      .replace(/\n/g, "")
      .replace(PUBLICKEY_HEADER, "")
      .replace(PUBLICKEY_FOOTER, "");

    const PRIVATEKEY_HEADER = "-----BEGIN PRIVATE KEY-----";
    const PRIVATEKEY_FOOTER = "-----END PRIVATE KEY-----";
    const pubkey = key.encrypt(publicKey, "base64");
    const privateKey = key
      .exportKey("pkcs8-private")
      .replace(/\n/g, "")
      .replace(PRIVATEKEY_HEADER, "")
      .replace(PRIVATEKEY_FOOTER, "");
    const privKey = key.encrypt(privateKey, "base64");

    await approveCandidate(id, pubkey, privKey);

    const message = `Your request to be a candidate in the ${election.title} has been approved.`;
    await sendCandidateMail({
      name: user.name,
      email: user.email,
      message,
    });
  }
);
export const declineCandidateHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const candidate = await findCandidateById(id);
    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    const user = await findUser(candidate.matricule);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const election = await getElectionById(candidate.electionId);
    if (!election) {
      throw new NotFoundError("Election not found");
    }
    const message = `Your request to be a candidate in the ${election.title} has been declined.`;
    await sendCandidateMail({
      name: user.name,
      email: user.email,
      message,
    });
  }
);
