import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { TokenExpiredError } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { SessionLogModel } from "../DB/models/SessionLog";
import { Role } from "@register-app/shared";


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    email: string;
  };
}

// export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded as AuthRequest["user"];
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// }

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded as AuthRequest["user"];
    return next();
  } catch (err: any) {
    // If token is expired
    if (err instanceof TokenExpiredError) {
      try {
        const payload = jwt.decode(token) as AuthRequest["user"];
        if (payload?.id) {
          await SessionLogModel.findOneAndUpdate(
            { userId: payload.id, logoutTime: null },
            { logoutTime: new Date() },
            { sort: { loginTime: -1 } }
          );
        }
      } catch (logErr) {
        console.error("Failed to log logout from expired token", logErr);
      }

      return res.status(401).json({ message: "Token expired" });
    }

    // All other JWT errors
    return res.status(403).json({ message: "Invalid token" });
  }
}

export function requireRole(allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}

export function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
