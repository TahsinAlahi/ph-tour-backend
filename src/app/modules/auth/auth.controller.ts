import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const loginInfo = await authService.credentialsLogin(req.body);
    setAuthCookie(res, loginInfo);

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

    setAuthCookie(res, newAccessToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New access token generated successfully",
      data: { accessToken: newAccessToken },
    });
  },
);

const logout = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    sendResponse<null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  },
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const userToken = req.user as JwtPayload;
    await authService.resetPassword(oldPassword, newPassword, userToken);
    sendResponse<null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  },
);

export default {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
