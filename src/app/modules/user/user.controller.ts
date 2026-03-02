import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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

const updateUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.params.id;

    const token = req.headers.authorization;
    const decodedToken = verifyToken(
      token!,
      envVars.JWT_ACCESS_SECRET,
    ) as JwtPayload;

    const user = await userServices.updateUser(
      userId as string,
      req.body,
      decodedToken,
    );

    sendResponse<IUser>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User updated successfully",
      data: user!,
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

export const userController = { createUser, getAllUsers, updateUser };
