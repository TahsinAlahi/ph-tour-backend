import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { generateToken, verifyToken } from "../../utils/jwt";
import { createUserToken } from "../../utils/userTokens";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isValidPassword = await user.isValidPassword(password!);
  if (!isValidPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  const userObj = user.toObject();
  const { accessToken, refreshToken } = createUserToken(userObj);
  delete userObj.password;

  return { accessToken, refreshToken, user: userObj };
};

const getNewAccessToken = async (refreshToken: string) => {
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

export const authService = {
  credentialsLogin,
  getNewAccessToken,
};
