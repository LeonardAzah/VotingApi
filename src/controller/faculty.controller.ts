import { Request, Response } from "express";
import {
  createFaculty,
  getFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} from "../service/faculty.service";

import asyncHandler from "../utils/handleAsync";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors";

const createFacultyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const name = req.body;
    const faculty = await createFaculty(name);
    res
      .status(StatusCodes.CREATED)
      .json({ response: "successfull", data: { faculty } });
  }
);

const getFacultiesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const faculties = await getFaculties();
    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { faculties } });
  }
);

const getFacultyByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const facultyId = req.params.id;
    const faculty = await getFacultyById(facultyId);

    if (!faculty) {
      throw new NotFoundError("Faculty not found");
    }

    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { faculty } });
  }
);

const updateFacultyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const facultyId = req.params.id;
    const data = req.body;

    const facultyExist = await getFacultyById(facultyId);

    if (!facultyExist) {
      throw new NotFoundError("Faculty not found");
    }

    const faculty = await updateFaculty(data, facultyId);

    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { faculty } });
  }
);

const deleteFacultyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const facultyId: string = req.params.id;

    const faculty = await getFacultyById(facultyId);

    if (!faculty) {
      throw new NotFoundError("Faculty not found");
    }

    await deleteFaculty(facultyId);
    res.status(200).json({ message: "Faculty deleted successfully" });
  }
);

export {
  createFacultyHandler,
  getFacultiesHandler,
  getFacultyByIdHandler,
  updateFacultyHandler,
  deleteFacultyHandler,
};
