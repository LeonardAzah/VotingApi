export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  sex: "FEMALE" | "MALE" | "OTHERS";
  departmentId: string;
  otp: string | null;
  role: "STUDENT" | "ADMIN";
  verified?: Date | null;
  isVerified?: boolean;
  passwordTokenExpirationDate: Date | null;
}
