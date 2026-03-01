import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "./user.interface";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post("/register", userController.createUser);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers,
);

export const userRoutes = router;
