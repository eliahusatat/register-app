import { SessionLogModel } from "../DB/models/SessionLog";
import { Request, Response } from "express";
import { UserModel } from "../DB/models/User";
import { AuthRequest } from "../middleware/auth";
import { generateToken } from "../utils/jwt";




export async function login(req: Request, res: Response) {
      const { email, password } = req.body;
    
      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }
    
      const user = await UserModel.findOne({ email, password });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    
      const token = generateToken({
        id: user._id.toString(),
        role: user.role,
        email: user.email,
      });
    
      const session = await SessionLogModel.create({
      userId: user._id,
      email: user.email,
      });
    
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
}

export async function logout(req: Request, res: Response) {
  const authReq = req as AuthRequest;
  const user = authReq.user;

  await SessionLogModel.findOneAndUpdate(
    { userId: user?.id, logoutTime: null },
    { logoutTime: new Date() },
    { sort: { loginTime: -1 } } // update the most recent session
  );
    
  res.json({ message: "Logged out successfully" });
}