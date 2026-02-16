import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IUser } from "./user.interface";

const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await userServices.createUser(req.body);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  },
);

const getAllUsers = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await userServices.getAllUsers();

    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: users,
    });
  },
);

export const userController = { createUser, getAllUsers };
