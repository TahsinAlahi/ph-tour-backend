import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const loginInfo = await authService.credentialsLogin(req.body);

    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: loginInfo,
    });
  },
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "Refresh token not found");
    }

    const newAccessToken = await authService.getNewAccessToken(refreshToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New access token generated successfully",
      data: { accessToken: newAccessToken },
    });
  },
);

export default {
  credentialsLogin,
  getNewAccessToken,
};
