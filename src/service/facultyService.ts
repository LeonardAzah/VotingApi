import { prisma } from "../utils/db.server";

export type Faculty = {
  id: string;
  name: string;
};

export const createFaculty = async (
  faculty: Omit<Faculty, "id">
): Promise<Faculty> => {
  const { name } = faculty;
  return prisma.faculty.create({
    data: {
      name,
    },
  });
};

export const getFaculties = async (): Promise<Faculty[]> => {
  return prisma.faculty.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

export const getFacultyById = async (id: string): Promise<Faculty | null> => {
  return prisma.faculty.findUnique({
    where: { id },
  });
};

export const updateFaculty = async (
  faculty: Omit<Faculty, "id">,
  id: string
): Promise<Faculty | null> => {
  const { name } = faculty;
  return prisma.faculty.update({
    where: { id },
    data: {
      name,
    },
  });
};

export const deleteFaculty = async (id: string): Promise<void> => {
  await prisma.faculty.delete({
    where: { id },
  });
};
