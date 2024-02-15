import { prisma } from "../utils/db.server";

type Election = {
  title: string;
  startDate: Date;
  endDate: Date;
  type: "FACULTY" | "DEPARTMENT";
  facultyId?: string;
  departmentId?: string;
};

export const createFacultyElection = async (
  election: Election
): Promise<Election> => {
  const { title, startDate, endDate, type, facultyId } = election;

  return prisma.election.create({
    data: {
      title,
      startDate,
      endDate,
      type,
      facultyId,
    },
    select: {
      title: true,
      startDate: true,
      endDate: true,
      type: true,
    },
  });
};

export const createDepartmentElection = async (
  election: Election
): Promise<Election> => {
  const { title, startDate, endDate, type, departmentId } = election;

  return prisma.election.create({
    data: {
      title,
      startDate,
      endDate,
      type,
      departmentId,
    },
    select: {
      title: true,
      startDate: true,
      endDate: true,
      type: true,
    },
  });
};

export const getElections = async (): Promise<Election[]> => {
  return prisma.election.findMany({
    select: {
      title: true,
      startDate: true,
      endDate: true,
      type: true,
    },
  });
};

export const getElectionById = async (id: string): Promise<Election | null> => {
  return prisma.election.findUnique({
    where: { id },
    select: {
      title: true,
      startDate: true,
      endDate: true,
      type: true,
    },
  });
};

export const getDepartmentElections = async (): Promise<Election[]> => {
  return prisma.election.findMany({
    where: { type: "DEPARTMENT" },
    select: {
      title: true,
      startDate: true,
      endDate: true,
      type: true,
    },
  });
};

export const getFacultyElections = async (): Promise<Election[]> => {
  return prisma.election.findMany({
    where: { type: "FACULTY" },
    select: {
      title: true,
      startDate: true,
      endDate: true,
      type: true,
    },
  });
};

export const updateElection = async (
  id: string,
  updates: Partial<Election>
): Promise<Election | null> => {
  const election = await prisma.election.update({
    where: { id },
    data: updates,
    select: {
      title: true,
      startDate: true,
      endDate: true,
      type: true,
    },
  });

  return election;
};

export const deleteElection = async (id: string): Promise<void> => {
  await prisma.election.delete({
    where: { id },
  });
};
