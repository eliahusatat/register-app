export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role?: Role;
}

export interface PublicUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: Role;
}

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];