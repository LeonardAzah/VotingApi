import { Request, Response } from "express";

import {
  createDepartmentElection,
  createFacultyElection,
  deleteElection,
  getDepartmentElections,
  getElectionById,
  getElections,
  getFacultyElections,
  updateElection,
} from "../service/electio .service";

import asyncHandler from "../utils/handleAsync";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors";

export const createFacultyElectionHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const election = await createFacultyElection(data);
    res
      .status(StatusCodes.CREATED)
      .json({ response: "successfull", data: { election } });
  }
);

export const createDepartmentElectionHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const election = await createDepartmentElection(data);
    res
      .status(StatusCodes.CREATED)
      .json({ response: "successfull", data: { election } });
  }
);

export const getElectionsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const elections = await getElections();
    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { elections } });
  }
);

export const getFacultyElectionsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const elections = await getFacultyElections();
    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { elections } });
  }
);

export const getDepartmentElectionsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const elections = await getDepartmentElections();
    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { elections } });
  }
);

export const getElectionByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const election = await getElectionById(id);

    if (!election) {
      throw new NotFoundError("Election not found");
    }

    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { election } });
  }
);

export const updateElectionHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;

    const electionExist = await getElectionById(id);

    if (!electionExist) {
      throw new NotFoundError("Election not found");
    }

    const election = await updateElection(id, data);

    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { election } });
  }
);

export const deleteElectionHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const electioin = await getElectionById(id);
    if (!electioin) {
      throw new NotFoundError("Election not found");
    }

    await deleteElection(id);

    res.status(200).json({ message: "Election deleted successfully" });
  }
);
