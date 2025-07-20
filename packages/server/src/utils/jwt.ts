import { Role } from "@register-app/shared";
import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "VDJHTRwielk@!#$!2ljkadsfha";
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export interface JwtPayload {
  id: string;
  role: Role;
  email: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}