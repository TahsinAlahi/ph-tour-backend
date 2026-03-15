import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
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
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return { accessToken };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  userToken: JwtPayload,
) => {
  const user = await User.findOne({ _id: userToken.userId });

  const doesOldPasswordMatches = await user?.isValidPassword(oldPassword);
  if (!doesOldPasswordMatches) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid old password");
  }

  // we are already checking if the user exists with checkAuth middleware so no need to check it again here
  user!.password = newPassword;
  await user!.save();
};

export const authService = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
