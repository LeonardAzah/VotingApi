import { Request, Response } from "express";
import {
  addCandidate,
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
