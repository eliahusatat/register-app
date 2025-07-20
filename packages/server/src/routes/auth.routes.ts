import express from "express";
import { login, logout } from "../controllers/auth.controller";
import { asyncHandler, authenticateToken } from "../middleware/auth";


const router = express.Router();

router.post("/login", login);
router.post("/logout", asyncHandler(authenticateToken),logout);

export default router;

