import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "./user.interface";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { updateUserZodSchema } from "./user.validation";

const router = Router();

router.post("/register", userController.createUser);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers,
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  userController.updateUser,
);

export const userRoutes = router;
