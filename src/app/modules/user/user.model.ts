import { Document, model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import bcrypt from "bcrypt";
import { envVars } from "../../config/env";

export interface DUser extends Document, IUser {
  isValidPassword(password: string): Promise<boolean>;
}

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  },
);

const userSchema = new Schema<DUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    // select:false will hide the password from the response
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
      default: Role.USER,
    },
    auths: [authProviderSchema],
  },
  {
    versionKey: false,
  },
);

userSchema.pre("save", async function () {
  const thisUser = this as DUser;
  if (!thisUser.password) return;

  if (!thisUser.isModified("password")) return;

  const salt = await bcrypt.genSalt(Number(envVars.BCRYPT_SALT_ROUND));
  thisUser.password = await bcrypt.hash(thisUser.password, salt);
});

// There might be some issues with the findOneAndUpdate method after changing the password

userSchema.methods.isValidPassword = async function (password: string) {
  try {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password comparison failed," + error);
  }
};

export const User = model<DUser>("User", userSchema);
