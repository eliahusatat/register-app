import { ROLES } from "@register-app/shared";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  phone:     { type: String, required: true },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.USER, },
});

export const UserModel = mongoose.model("User", userSchema);


