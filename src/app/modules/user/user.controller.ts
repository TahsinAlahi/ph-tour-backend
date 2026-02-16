/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });

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
