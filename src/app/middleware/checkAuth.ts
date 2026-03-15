import { NextFunction, Request, Response } from "express";
import { IsActive, Role } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
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

      const user = await User.findOne({ email: token.email });

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      if (
        user.isActive === IsActive.BLOCKED ||
        user.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${user.isActive.toLowerCase()}`,
        );
      }
      if (user.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
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
