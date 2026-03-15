import { Router } from "express";
import authController from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { resetPasswordZodSchema } from "./auth.validation";

const router = Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token", authController.getNewAccessToken);
router.post("/logout", authController.logout);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  validateRequest(resetPasswordZodSchema),
  authController.resetPassword,
);

export const authRoutes = router;
