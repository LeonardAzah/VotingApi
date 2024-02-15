import { IUser } from "./user.interface";
export interface IStudent extends IUser {
  image?: string | null;
  matricule?: string | null;
}
