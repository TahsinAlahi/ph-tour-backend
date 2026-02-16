/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";

const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await userServices.createUser(req.body);
    res
      .status(httpStatus.CREATED)
      .send({ message: "User registered successfully.", user });
  },
);

const getAllUsers = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await userServices.getAllUsers();

    res.status(httpStatus.OK).send({ users });
  },
);

export const userController = { createUser, getAllUsers };
