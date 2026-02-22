import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;
  const doesUserExist = await User.exists({ email });
  if (doesUserExist) {
    throw new AppError(StatusCodes.CONFLICT, "The email already exists!!");
  }

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email!,
  };

  const user = new User({ email, auths: [authProvider], ...rest });
  await user.save();

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();

  return users;
};

export const userServices = {
  createUser,
  getAllUsers,
};
