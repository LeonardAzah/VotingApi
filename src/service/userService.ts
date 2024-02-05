import { prisma } from "../utils/db.server";

export type Student = {
  name: string;
  email: string;
  image: string;
  password: string;
  matricule: string;
  dateOfBirth: Date;
  sex: UserSex;
  departmentId: string;
  otp: string;
  verified?: Date | null;
  isVerified?: boolean;
};

type StudentRead = {
  id: string;
  name: string;
  email: string;
  image: string;
  password: string;
  matricule: string;
  dateOfBirth: Date;
  sex: UserSex;
  departmentId: string;
  otp: string | null;
  verified?: Date | null;
  isVerified?: boolean;
  role: UserRole;
  passwordTokenExpirationDate: Date | null;
};
type SchoolAdmin = {
  name: string;
  email: string;
  password: string;
  departmentId: string;
  dateOfBirth: Date;
  sex: UserSex;
  role: UserRole;
};
type UserSex = "MALE" | "FEMALE" | "OTHERS";
type UserRole = "STUDENT" | "ADMIN";

export const createStudent = async (
  user: Omit<Student, "verified" | "isVerified">
): Promise<Student> => {
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

export const createAdministrator = async (
  user: SchoolAdmin
): Promise<SchoolAdmin> => {
  const { name, email, password, dateOfBirth, departmentId, role, sex } = user;
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      dateOfBirth,
      departmentId,
      role,
      sex,
    },
  });
};

export const findUser = async (
  identifier: string
): Promise<StudentRead | null> => {
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
  updates: Partial<Student>
): Promise<Student | null> => {
  const updatedStudent = await prisma.user.update({
    where: { id: userId },
    data: updates,
  });

  return updatedStudent;
};
