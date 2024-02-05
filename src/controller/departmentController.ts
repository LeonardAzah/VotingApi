import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../service/departmentService";
import asyncHandler from "../utils/handleAsync";
import { NotFoundError } from "../errors";

export const createDepartmentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const department = await createDepartment(data);
    res
      .status(StatusCodes.CREATED)
      .json({ response: "successfull", data: { department } });
  }
);

export const getDepartmentsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const departments = await getDepartments();
    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { departments } });
  }
);

export const getDepartmentByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const departmentId: string = req.params.id;
    const department = await getDepartmentById(departmentId);

    if (!department) {
      throw new NotFoundError("Department not found");
    }
    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { department } });
  }
);

export const updateDepartmentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const departmentId: string = req.params.id;
    const data = req.body;

    const departmentExist = await getDepartmentById(departmentId);
    if (!departmentExist) {
      throw new NotFoundError("Department not found");
    }

    const department = await updateDepartment(data, departmentId);
    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", data: { department } });
  }
);

export const deleteDepartmentHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const departmentId = req.params.id;
    const department = await getDepartmentById(departmentId);
    if (!department) {
      throw new NotFoundError("Department not found");
    }
    await deleteDepartment(departmentId);
    res.status(StatusCodes.OK).json({ response: "successfull" });
  }
);
