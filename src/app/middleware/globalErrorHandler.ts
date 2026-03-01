import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let errorMessage = `Something went wrong!!`;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    stack: envVars.NODE_ENV === "development" ? err?.stack : null,
  });
};
