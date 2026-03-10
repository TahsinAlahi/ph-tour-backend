import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const doesSuperAdminExist = await User.exists({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (doesSuperAdminExist) {
      console.log("Super admin already exists");
      return;
    }

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL!,
    };

    const payload: IUser = {
      email: envVars.SUPER_ADMIN_EMAIL,
      password: envVars.SUPER_ADMIN_PASSWORD,
      auths: [authProvider],
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      isVerified: true,
    };

    await User.create(payload);

    console.log("Super admin created");
  } catch (error) {
    console.log(error);
  }
};
