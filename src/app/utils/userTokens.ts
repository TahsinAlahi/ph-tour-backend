import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../modules/user/user.model";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES,
  );

  return { accessToken, refreshToken };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string,
) => {
  const verifiedToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET,
  ) as JwtPayload;

  if (!verifiedToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  const user = await User.findOne({ _id: verifiedToken.userId });

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

  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    payload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  return accessToken;
};
