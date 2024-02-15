import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError, BadRequestError } from "../errors";
import asyncHandler from "../utils/handleAsync";
import { findUser, updateUser } from "../service/user.service";
import { createTokenUser } from "../utils/createTokenUser";
import { deleteToken, findToken } from "../service/auth.service";
import { attachCookiesToResponse } from "../utils/jwt";
import { createToken } from "../service/auth.service";
import crypto from "crypto";
import logger from "../utils/logger";
import otpGenerator from "otp-generator";
import sendPasswordResetEmail from "../utils/sendResetPassword";

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { otp, email } = req.body;
  const user = await findUser(email);

  if (!user) {
    throw new UnauthenticatedError("Verification Failed");
  }

  if (otp !== user.otp) {
    throw new UnauthenticatedError("Verification Failed");
  }

  const updates = {
    isVerified: true,
    verified: new Date(),
    otp: "",
  };
  await updateUser(user.id, updates);

  res
    .status(StatusCodes.OK)
    .json({ response: "successfull", msg: "Email verified" });
});

export const loginStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { matricule, password }: { matricule: string; password: string } =
      req.body;

    const user = await findUser(matricule);

    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    if (!user.isVerified) {
      throw new UnauthenticatedError("Please verify your email");
    }

    const tokenUser = createTokenUser(user);

    // Create refresh token
    let refreshToken = "";

    // Check for existing tokens
    const existingToken = await findToken(user.id);
    logger.info({ token: existingToken });

    if (existingToken) {
      const { isValid } = existingToken;

      if (!isValid) {
        throw new UnauthenticatedError("Invalid Credentials");
      }

      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      res.status(StatusCodes.OK).json({ user: tokenUser });
      return;
    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent: string = req.headers["user-agent"] ?? "";
    const ip: string = req.ip ?? "";
    const userToken = { refreshToken, ip, userAgent, userId: user.id };
    await createToken(userToken);

    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", user: tokenUser });
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await findUser(email);

    if (user) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      // send email
      await sendPasswordResetEmail({
        name: user.name,
        email: user.email,
        otp,
      });

      const tenMinutes = 1000 * 60 * 10;
      const expirationDate = new Date(Date.now() + tenMinutes);

      const passwordTokenExpirationDate = expirationDate.toISOString();
      const updates = {
        otp: otp,
        passwordTokenExpirationDate: expirationDate,
      };
      await updateUser(user.id, updates);
    }

    res.status(StatusCodes.OK).json({
      response: "successfull",
      msg: "Please check your email for reset password link",
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      otp,
      email,
      password,
    }: { otp: string; email: string; password: string } = req.body;

    const user = await findUser(email);
    if (!user) {
      throw new UnauthenticatedError("Verification Failed");
    }

    if (!user.isVerified) {
      throw new UnauthenticatedError("Please verify your email");
    }

    if (user) {
      const currentDate = new Date();
      if (
        user.otp === otp &&
        user.passwordTokenExpirationDate &&
        user.passwordTokenExpirationDate > currentDate
      ) {
        const salt = await bcrypt.genSalt(10);

        const passwordHash = await bcrypt.hash(password, salt);
        const updates = {
          password: passwordHash,
          otp: "",
          passwordTokenExpirationDate: null,
        };

        await updateUser(user.id, updates);
      }
    }

    res
      .status(StatusCodes.OK)
      .json({ response: "successfull", msg: "Reset password" });
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.body.user.id;

  await deleteToken(userId);

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
});
