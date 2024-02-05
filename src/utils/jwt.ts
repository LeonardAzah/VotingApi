import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { User } from "./createTokenUser";

dotenv.config();

export type Payload = {
  user: User;
  refreshToken?: string;
};

const createJWT = ({ payload }: { payload: Payload }): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
};

const isTokenValid = (token: string): any =>
  jwt.verify(token, process.env.JWT_SECRET as string);

const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: {
  res: Response;
  user: User;
  refreshToken?: string;
}): void => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 2;
  const longerExp = 1000 * 60 * 60 * 24;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + longerExp),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
