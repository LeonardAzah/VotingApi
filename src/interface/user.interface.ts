interface User {
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  sex: "FEMALE" | "MALE" | "OTHERS";
  departmentId: string;
  otp: string;
  role: "STUDENT" | "ADMIN";
}
