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

export const authService = {
  credentialsLogin,
  getNewAccessToken,
};
