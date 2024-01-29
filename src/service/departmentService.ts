import { prisma } from "../utils/db.server";
import { Faculty } from "./facultyService";

export type Department = {
  name: string;
  facultyId: string;
};
export type DepartmentRead = {
  id: string;
  name: string;
  faculty: Faculty;
};

export async function createDepartment(
  department: Department
): Promise<Department> {
  const { name, facultyId } = department;
  return prisma.department.create({
    data: {
      name,
      facultyId,
    },
  });
}

export const getDepartments = async (): Promise<DepartmentRead[]> => {
  return prisma.department.findMany({
    select: {
      id: true,
      name: true,
      faculty: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getDepartmentById = async (
  id: string
): Promise<DepartmentRead | null> => {
  return prisma.department.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      faculty: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateDepartment = async (
  department: Omit<Department, "facultyId">,
  id: string
): Promise<Department | null> => {
  const { name } = department;
  return prisma.department.update({
    where: { id },
    data: {
      name,
    },
  });
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await prisma.department.delete({
    where: { id },
  });
};
