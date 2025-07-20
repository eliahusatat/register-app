import express from "express";
import { asyncHandler, authenticateToken } from "../middleware/auth";
import { createUser, getUsers, updateUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/", asyncHandler(authenticateToken), getUsers);
router.post("/", createUser);
router.put("/:id", asyncHandler(authenticateToken), updateUser);

export default router;