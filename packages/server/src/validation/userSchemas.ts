import { z } from "zod";


export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .email("Invalid email format")
    .regex(/^\S+@gmail\.com$/, "Email must be a valid @gmail.com address"),
  password: z
    .string()
    .refine((val) => /[A-Z]/.test(val), "Must include at least one uppercase letter")
    .refine((val) => /[a-z]/.test(val), "Must include at least one lowercase letter")
    .refine((val) => /[0-9]/.test(val), "Must include at least one digit")
    .refine(
      (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
      "Must include at least one special character"
    ),
  phone: z.string().regex(/^05\d-\d{7}$/, "Phone must be in format 05x-xxxxxxx"),
});

export const partialUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().regex(/^\S+@gmail\.com$/).optional(),
  password: z
    .string()
    .refine((val) => /[A-Z]/.test(val), "Must include at least one uppercase letter")
    .refine((val) => /[a-z]/.test(val), "Must include at least one lowercase letter")
    .refine((val) => /[0-9]/.test(val), "Must include at least one digit")
    .refine((val) => /[!@#$%^&*(),.?\":{}|<>]/.test(val), "Must include at least one special character")
    .optional(),
  phone: z.string().regex(/^05\d-\d{7}$/).optional(),
});