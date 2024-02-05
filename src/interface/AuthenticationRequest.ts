import { Request } from "express";

interface AuthenticatedRequest extends Request {
  user: {
    name: string;
    id: string;
    role: string;
  };
}

export default AuthenticatedRequest;
