import { NextFunction, Request, Response } from "express";
import { Role } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Access token not found");
      }

      const token = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid access token");
      }

      if (!authRoles.includes(token.role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized to access this route",
        );
      }

      req.user = token;
      next();
    } catch (error) {
      next(error);
    }
  };
