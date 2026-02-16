/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userServices.createUser(req.body);

    res
      .status(httpStatus.CREATED)
      .send({ message: "User registered successfully.", user });
  } catch (err: any) {
    console.log(err);
    res.status(httpStatus.BAD_REQUEST).json({
      message: `Something went wrong!! ${err}`,
      err,
    });
  }
};

export const userController = { createUser };
