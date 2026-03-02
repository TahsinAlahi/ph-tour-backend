import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

const createUser = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;
  const doesUserExist = await User.exists({ email });
  if (doesUserExist) {
    throw new AppError(httpStatus.CONFLICT, "The email already exists!!");
  }

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email!,
  };

  const user = new User({ email, auths: [authProvider], ...rest });
  await user.save();

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    // Check if the user is authorized to update user role
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to update user role",
      );
    }

    // Check if the user is authorized to update user to super admin role
    if (
      payload.role === Role.SUPER_ADMIN &&
      decodedToken.role !== Role.SUPER_ADMIN
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to update super admin role",
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // const updatedUser = await User.findOneAndUpdate({ _id: userId }, payload, {
  //   new: true,
  //   runValidator: true,
  // });

  Object.assign(user, payload);

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
  updateUser,
};
