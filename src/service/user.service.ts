import { IUser } from "../interface/user.interface";
import { prisma } from "../utils/db.server";
import { IStudent } from "../interface/student.interface";

export const createStudent = async (user: IStudent): Promise<IStudent> => {
  const {
    name,
    email,
    image,
    password,
    matricule,
    dateOfBirth,
    sex,
    departmentId,
    otp,
  } = user;
  return prisma.user.create({
    data: {
      name,
      email,
      image,
      password,
      matricule,
      dateOfBirth,
      sex,
      departmentId,
      otp,
    },
  });
};

export const createAdministrator = async (user: IUser): Promise<IUser> => {
  const { name, email, password, dateOfBirth, departmentId, sex } = user;
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      dateOfBirth,
      departmentId,
      role: "ADMIN",
      sex,
    },
  });
};

export const findUser = async (
  identifier: string
): Promise<IStudent | null> => {
  return prisma.user.findFirst({
    where: {
      OR: [
        { id: identifier },
        { email: identifier },
        { matricule: identifier },
      ],
    },
  });
};

export const updateUser = async (
  userId: string,
  updates: Partial<IStudent>
): Promise<IStudent | null> => {
  const updatedStudent = await prisma.user.update({
    where: { id: userId },
    data: updates,
  });

  return updatedStudent;
};
