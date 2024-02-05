import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError, UnauthorizedError } from "../errors";
import { isTokenValid } from "../utils/jwt";
import { attachCookiesToResponse } from "../utils/jwt";
import { findToken } from "../service/authService";
import { User } from "../utils/createTokenUser";
import AuthenticatedRequest from "../interface/AuthenticationRequest";
import asyncHandler from "../utils/handleAsync";

type Payload = {
  user: User;
  refreshToken: string;
};

const authenticateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken, accessToken } = req.signedCookies;

    try {
      if (accessToken) {
        const payload: Payload = isTokenValid(accessToken);
        req.body.user = payload.user;
        return next();
      }

      const payload = isTokenValid(refreshToken);
      const existingToken = await findToken({
        user: payload.user.id,
        refreshToken: payload.refreshToken,
      });

      if (!existingToken || !existingToken?.isValid) {
        throw new UnauthenticatedError("Authentication Invalid");
      }

      attachCookiesToResponse({
        res,
        user: payload.user,
        refreshToken: existingToken.refreshToken,
      });

      req.body.user = payload.user;
      next();
    } catch (error) {
      throw next(new UnauthenticatedError("Authentication Invalid"));
    }
  }
);

const authorizePermissions = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw next(new UnauthorizedError("Unauthorized to access this resource"));
    }
    next();
  };
};

export { authenticateUser, authorizePermissions };
