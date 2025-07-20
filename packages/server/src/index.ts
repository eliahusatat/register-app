// import express, { Request, Response } from "express";
// import { PublicUser, ROLES, User } from "@register-app/shared";
// import { z } from "zod";
// import cors from "cors";
// import { connectToMongo } from "./DB/mongoose";
// import { UserModel } from "./DB/models/User";
// import { SessionLogModel } from "./DB/models/SessionLog";
// import { generateToken } from "./utils/jwt";
// import { asyncHandler, authenticateToken, AuthRequest, requireRole } from "./middleware/auth";


// const app = express();
// const port = 3001;

// app.use(express.json());
// app.use(cors());

// const users: User[] = [];

// const userSchema = z.object({
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   email: z
//     .string()
//     .email("Invalid email format")
//     .regex(/^\S+@gmail\.com$/, "Email must be a valid @gmail.com address"),
//   password: z
//     .string()
//     .refine((val) => /[A-Z]/.test(val), "Must include at least one uppercase letter")
//     .refine((val) => /[a-z]/.test(val), "Must include at least one lowercase letter")
//     .refine((val) => /[0-9]/.test(val), "Must include at least one digit")
//     .refine(
//       (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
//       "Must include at least one special character"
//     ),
//   phone: z.string().regex(/^05\d-\d{7}$/, "Phone must be in format 05x-xxxxxxx"),
// });

// const partialUserSchema = z.object({
//   firstName: z.string().min(1).optional(),
//   lastName: z.string().min(1).optional(),
//   email: z.string().email().regex(/^\S+@gmail\.com$/).optional(),
//   password: z
//     .string()
//     .refine((val) => /[A-Z]/.test(val), "Must include at least one uppercase letter")
//     .refine((val) => /[a-z]/.test(val), "Must include at least one lowercase letter")
//     .refine((val) => /[0-9]/.test(val), "Must include at least one digit")
//     .refine((val) => /[!@#$%^&*(),.?\":{}|<>]/.test(val), "Must include at least one special character")
//     .optional(),
//   phone: z.string().regex(/^05\d-\d{7}$/).optional(),
// });



// app.post("/api/user", async (req: Request, res: Response) => {
//   const parseResult = userSchema.safeParse(req.body);

//   if (!parseResult.success) {
//     return res.status(400).json({
//       message: "Validation failed",
//       errors: parseResult.error.flatten().fieldErrors,
//     });
//   }

//   const { email } = parseResult.data;

//   const existing = await UserModel.findOne({ email });
//   if (existing) {
//     return res.status(409).json({
//       message: "A user with this email already exists",
//       field: "email",
//     });
//   }

//   try {
//     const user = new UserModel(parseResult.data);
//     await user.save();

//     const { password, phone, ...safeUser } = user.toObject();
//     res.status(201).json(safeUser);
//   } catch (err: any) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// app.get("/api/user", asyncHandler(authenticateToken) ,async (req: Request, res: Response) => {
//   const users  = await UserModel.find().select("-password -phone");

//   const result: PublicUser[] = users.map((u: any) => ({
//     _id: u._id.toString(),
//     firstName: u.firstName,
//     lastName: u.lastName,
//     email: u.email,
//     role: u.role,
//   }));

//   res.json(result);
// });

// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Missing email or password" });
//   }

//   const user = await UserModel.findOne({ email, password });
//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = generateToken({
//     id: user._id.toString(),
//     role: user.role,
//     email: user.email,
//   });

//   const session = await SessionLogModel.create({
//   userId: user._id,
//   email: user.email,
//   });

//   res.json({
//     message: "Login successful",
//     token,
//     user: {
//       id: user._id,
//       email: user.email,
//       role: user.role,
//       firstName: user.firstName,
//       lastName: user.lastName,
//     },
//   });
// });

// app.post("/api/logout", asyncHandler(authenticateToken), async (req, res) => {
//   const authReq = req as AuthRequest;
//   const user = authReq.user;

//   await SessionLogModel.findOneAndUpdate(
//     { userId: user?.id, logoutTime: null },
//     { logoutTime: new Date() },
//     { sort: { loginTime: -1 } } // update the most recent session
//   );

//   res.json({ message: "Logged out successfully" });
// });


// app.get("/api/sessions", asyncHandler(authenticateToken), asyncHandler(requireRole([ROLES.ADMIN])), async (req, res) => {
//   const sessions = await SessionLogModel.find().sort({ loginTime: -1 });
//   res.json(sessions);
// });


// app.put("/api/user/:id", asyncHandler(authenticateToken),  async (req, res) => {
//   try {
//       const authReq = req as AuthRequest;
//   const { id } = req.params;
//   if (authReq.user?.role !== ROLES.ADMIN && authReq.user?.id !== id) {
  
//     return res.status(403).json({ message: "You are not allowed to edit this user" });
//   }

//     // Remove empty fields (don't overwrite with "")
//     const updateData = { ...req.body };
//     if (!updateData.password) delete updateData.password;
//     if (!updateData.phone) delete updateData.phone;

//     const parseResult = partialUserSchema.safeParse(updateData);

//     if (!parseResult.success) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: parseResult.error.flatten().fieldErrors,
//       });
//     }

//     const existing = await UserModel.findOne({ email: updateData.email });
//       if (existing && existing._id.toString() !== id) {
//         return res.status(409).json({
//           message: "Another user with this email already exists",
//           field: "email",
//         });
//       }
  

//     const updated = await UserModel.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updated) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(updated);
//   } catch (err: any) {
//     res.status(500).json({ message: "Update failed", error: err.message });
//   }
// });


// connectToMongo();

// app.listen(port, () => {
//   console.log(`Server listening on http://localhost:${port}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectToMongo } from "./DB/mongoose";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import sessionRoutes from "./routes/session.routes";


const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api", authRoutes);
app.use("/api/sessions", sessionRoutes);



connectToMongo();

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


