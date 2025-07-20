import { Request, Response } from "express";
import { PublicUser, ROLES } from "@register-app/shared";
import { AuthRequest } from "../middleware/auth";
import { UserModel } from "../DB/models/User";
import { partialUserSchema, userSchema } from "../validation/userSchemas";

export async function getUsers(req: AuthRequest, res: Response) {
      const users  = await UserModel.find().select("-password -phone");
    
      const result: PublicUser[] = users.map((u: any) => ({
        _id: u._id.toString(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
      }));
    
      res.json(result);
}

export async function createUser(req: Request, res: Response) {
  const parseResult = userSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const { email } = parseResult.data;

  const existing = await UserModel.findOne({ email });
  if (existing) {
    return res.status(409).json({
      message: "A user with this email already exists",
      field: "email",
    });
  }

  try {
    const user = new UserModel(parseResult.data);
    await user.save();

    const { password, phone, ...safeUser } = user.toObject();
    res.status(201).json(safeUser);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function updateUser(req: Request, res: Response) {
      try {
          const authReq = req as AuthRequest;
      const { id } = req.params;
      if (authReq.user?.role !== ROLES.ADMIN && authReq.user?.id !== id) {
      
        return res.status(403).json({ message: "You are not allowed to edit this user" });
      }
    
        // Remove empty fields (don't overwrite with "")
        const updateData = { ...req.body };
        if (!updateData.password) delete updateData.password;
        if (!updateData.phone) delete updateData.phone;
    
        const parseResult = partialUserSchema.safeParse(updateData);
    
        if (!parseResult.success) {
          return res.status(400).json({
            message: "Validation failed",
            errors: parseResult.error.flatten().fieldErrors,
          });
        }
    
        const existing = await UserModel.findOne({ email: updateData.email });
          if (existing && existing._id.toString() !== id) {
            return res.status(409).json({
              message: "Another user with this email already exists",
              field: "email",
            });
          }
      
    
        const updated = await UserModel.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
    
        if (!updated) {
          return res.status(404).json({ message: "User not found" });
        }
    
        res.json(updated);
      } catch (err: any) {
        res.status(500).json({ message: "Update failed", error: err.message });
      }
 
}
